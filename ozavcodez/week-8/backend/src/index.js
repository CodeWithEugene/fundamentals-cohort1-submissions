import express from 'express';
import cors from 'cors';
import { createLogger } from './utils/logger.js';
import { initMetrics } from './utils/metrics.js';
import errorHandler from './middleware/errorHandler.js';
import healthRouter from './routes/health.js';
import metricsRouter from './routes/metrics.js';
import apiRouter from './routes/api.js';

const app = express();
const logger = createLogger();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize metrics
initMetrics();

// Routes
app.use('/health', healthRouter);
app.use('/metrics', metricsRouter);
app.use('/api', apiRouter);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(port, () => {
  logger.info(`Backend server running on port ${port}`);
  logger.info(`Health check: http://localhost:${port}/health`);
  logger.info(`Metrics: http://localhost:${port}/metrics`);
});
