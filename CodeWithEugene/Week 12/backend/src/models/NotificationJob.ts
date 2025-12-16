import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType = 'email' | 'sms' | 'push';

export type NotificationStatus =
  | 'pending'
  | 'queued'
  | 'sending'
  | 'sent'
  | 'failed'
  | 'retrying';

export interface NotificationJobDocument extends Document {
  type: NotificationType;
  recipient: string;
  message: string;
  metadata?: Record<string, unknown>;
  status: NotificationStatus;
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationJobSchema = new Schema<NotificationJobDocument>(
  {
    type: {
      type: String,
      enum: ['email', 'sms', 'push'],
      required: true
    },
    recipient: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    metadata: {
      type: Schema.Types.Mixed
    },
    status: {
      type: String,
      enum: ['pending', 'queued', 'sending', 'sent', 'failed', 'retrying'],
      default: 'pending'
    },
    attempts: {
      type: Number,
      default: 0
    },
    maxAttempts: {
      type: Number,
      default: 5
    },
    lastError: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const NotificationJob = mongoose.model<NotificationJobDocument>(
  'NotificationJob',
  NotificationJobSchema
);


