import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 4200,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/wavecom_notifications',
  rabbitMqUrl: process.env.RABBITMQ_URL || 'amqp://localhost',
  notificationQueue: process.env.NOTIFICATION_QUEUE || 'notification-jobs',
  maxAttempts: Number(process.env.MAX_ATTEMPTS) || 5
};


