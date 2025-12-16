import { Router } from 'express';
import {
  createNotificationJob,
  getNotificationJob,
  listNotificationJobs
} from '../services/notificationService';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { type, recipient, message, metadata } = req.body;

    if (!type || !recipient || !message) {
      return res.status(400).json({ message: 'type, recipient and message are required' });
    }

    const job = await createNotificationJob({ type, recipient, message, metadata });

    return res.status(201).json({
      id: job.id,
      status: job.status,
      attempts: job.attempts,
      maxAttempts: job.maxAttempts,
      createdAt: job.createdAt
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create notification job', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await getNotificationJob(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.json(job);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get notification job', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const jobs = await listNotificationJobs();
    return res.json(jobs);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to list notification jobs', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;


