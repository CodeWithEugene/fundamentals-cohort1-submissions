import { Channel, ConsumeMessage } from 'amqplib';
import { connectMongo } from '../config/db';
import { config } from '../config/env';
import { getRabbitChannel } from '../config/rabbitmq';
import { NotificationJob } from '../models/NotificationJob';
import { NotificationLog } from '../models/NotificationLog';

const mockSendNotification = async (type: string, recipient: string, message: string): Promise<void> => {
  // Simulate IO latency
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Simple failure injection ~20% of the time
  if (Math.random() < 0.2) {
    throw new Error(`Mock provider failed for ${type} notification`);
  }
};

const handleMessage = async (channel: Channel, msg: ConsumeMessage | null): Promise<void> => {
  if (!msg) return;

  const { jobId } = JSON.parse(msg.content.toString()) as { jobId: string };

  const job = await NotificationJob.findById(jobId);
  if (!job) {
    channel.ack(msg);
    return;
  }

  try {
    job.status = 'sending';
    await job.save();
    await NotificationLog.create({ jobId: job.id, event: 'sending' });

    await mockSendNotification(job.type, job.recipient, job.message);

    job.status = 'sent';
    await job.save();
    await NotificationLog.create({ jobId: job.id, event: 'sent' });

    channel.ack(msg);
  } catch (error) {
    job.attempts += 1;
    job.lastError = (error as Error).message;

    if (job.attempts >= job.maxAttempts) {
      job.status = 'failed';
      await job.save();
      await NotificationLog.create({
        jobId: job.id,
        event: 'failed',
        details: { error: job.lastError }
      });

      channel.ack(msg);
      return;
    }

    job.status = 'retrying';
    await job.save();
    await NotificationLog.create({
      jobId: job.id,
      event: 'retry_scheduled',
      details: { attempts: job.attempts }
    });

    // Naive retry with fixed backoff using requeue + delay
    const delayMs = 1000 * job.attempts;

    setTimeout(() => {
      channel.sendToQueue(
        config.notificationQueue,
        Buffer.from(JSON.stringify({ jobId: job.id })),
        { persistent: true }
      );
    }, delayMs);

    channel.ack(msg);
  }
};

const startWorker = async (): Promise<void> => {
  await connectMongo();
  const channel = await getRabbitChannel();

  channel.prefetch(50); // simple backpressure

  channel.consume(
    config.notificationQueue,
    (msg) => {
      void handleMessage(channel, msg);
    },
    { noAck: false }
  );
};

void startWorker();


