import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import paymentRoutes from './routes/payment.routes';
import { config } from './config/env';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'payverse-backend', env: config.nodeEnv });
});

app.use('/api', paymentRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`PayVerse backend listening on port ${config.port}`);
});
