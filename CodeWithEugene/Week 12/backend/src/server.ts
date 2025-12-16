import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { connectMongo } from './config/db';
import { config } from './config/env';
import notificationRoutes from './routes/notificationRoutes';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: '*'
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/notifications', notificationRoutes);

const start = async (): Promise<void> => {
  await connectMongo();

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`WaveCom Notification service listening on port ${config.port}`);
  });
};

void start();


