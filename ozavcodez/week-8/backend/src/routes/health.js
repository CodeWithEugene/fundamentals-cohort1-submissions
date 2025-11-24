import { Router } from 'express';
import { logger } from '../utils/logger.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const uptime = process.uptime();
    const memUsage = process.memoryUsage();

    logger.info('Health check requested');

    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.round(uptime),
        message: 'Service is operational',
        metrics: {
          memory: {
            heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
            totalHeapMB: Math.round(memUsage.heapTotal / 1024 / 1024),
            externalMB: Math.round(memUsage.external / 1024 / 1024),
          },
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ error }, 'Health check failed');
    res.status(500).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: 'Failed to retrieve health status',
        details: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
