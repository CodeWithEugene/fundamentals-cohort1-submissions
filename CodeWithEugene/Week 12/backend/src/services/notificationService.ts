import { Channel } from 'amqplib';
import { config } from '../config/env';
import { getRabbitChannel } from '../config/rabbitmq';
import { NotificationJob, NotificationJobDocument } from '../models/NotificationJob';
import { NotificationLog } from '../models/NotificationLog';

export interface CreateNotificationInput {
  type: 'email' | 'sms' | 'push';
  recipient: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export const createNotificationJob = async (
  payload: CreateNotificationInput
): Promise<NotificationJobDocument> => {
  const job = await NotificationJob.create({
    ...payload,
    status: 'pending',
    attempts: 0,
    maxAttempts: config.maxAttempts
  });

  await NotificationLog.create({
    jobId: job.id,
    event: 'created',
    details: { type: job.type }
  });

  const channel: Channel = await getRabbitChannel();
  channel.sendToQueue(
    config.notificationQueue,
    Buffer.from(
      JSON.stringify({
        jobId: job.id
      })
    ),
    {
      persistent: true
    }
  );

  job.status = 'queued';
  await job.save();

  await NotificationLog.create({
    jobId: job.id,
    event: 'queued'
  });

  return job;
};

export const getNotificationJob = async (id: string): Promise<NotificationJobDocument | null> => {
  return NotificationJob.findById(id).exec();
};

export const listNotificationJobs = async (): Promise<NotificationJobDocument[]> => {
  return NotificationJob.find().sort({ createdAt: -1 }).limit(100).exec();
};


