import amqp, { Channel, Connection } from 'amqplib';
import { config } from './env';

let connection: Connection | null = null;
let channel: Channel | null = null;

export const getRabbitChannel = async (): Promise<Channel> => {
  if (channel) return channel;

  connection = await amqp.connect(config.rabbitMqUrl);
  channel = await connection.createChannel();
  await channel.assertQueue(config.notificationQueue, {
    durable: true
  });

  return channel;
};

export const closeRabbit = async (): Promise<void> => {
  await channel?.close();
  await connection?.close();
  channel = null;
  connection = null;
};


