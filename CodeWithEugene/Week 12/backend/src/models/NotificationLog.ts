import mongoose, { Document, Schema } from 'mongoose';

export interface NotificationLogDocument extends Document {
  jobId: string;
  event: string;
  details?: Record<string, unknown>;
  createdAt: Date;
}

const NotificationLogSchema = new Schema<NotificationLogDocument>(
  {
    jobId: {
      type: String,
      required: true,
      index: true
    },
    event: {
      type: String,
      required: true
    },
    details: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const NotificationLog = mongoose.model<NotificationLogDocument>(
  'NotificationLog',
  NotificationLogSchema
);


