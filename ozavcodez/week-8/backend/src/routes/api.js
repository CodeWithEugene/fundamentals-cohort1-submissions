import { Router } from 'express';
import { logger } from '../utils/logger.js';
import { deploymentCounter } from '../utils/metrics.js';

const router = Router();

const deployments = [
  { id: '1', name: 'Backend v1.0.0', service: 'api', version: '1.0.0', status: 'success', timestamp: new Date(Date.now() - 3600000).toISOString(), duration: 45 },
  { id: '2', name: 'Frontend v2.1.0', service: 'web', version: '2.1.0', status: 'success', timestamp: new Date(Date.now() - 1800000).toISOString(), duration: 32 },
  { id: '3', name: 'Worker v1.5.0', service: 'worker', version: '1.5.0', status: 'success', timestamp: new Date(Date.now() - 900000).toISOString(), duration: 28 },
];

router.get('/deployments', (req, res) => {
  try {
    logger.info('Fetching deployments');
    res.json({
      success: true,
      data: deployments,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch deployments');
    res.status(500).json({
      success: false,
      error: {
        code: 'DEPLOYMENTS_FETCH_FAILED',
        message: 'Failed to retrieve deployments',
        details: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/deployments/:id', (req, res) => {
  try {
    const deployment = deployments.find(d => d.id === req.params.id);
    
    if (!deployment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DEPLOYMENT_NOT_FOUND',
          message: `Deployment with ID ${req.params.id} not found`,
        },
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: deployment,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch deployment');
    res.status(500).json({
      success: false,
      error: {
        code: 'DEPLOYMENT_FETCH_FAILED',
        message: 'Failed to retrieve deployment',
        details: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

router.post('/deployments', (req, res) => {
  try {
    const { service, version, name } = req.body;

    if (!service || !version) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Missing required fields: service and version',
        },
        timestamp: new Date().toISOString(),
      });
    }

    logger.info({ service, version }, 'New deployment');
    deploymentCounter.inc({ service, status: 'success' });

    const deployment = {
      id: String(deployments.length + 1),
      name: name || `${service} v${version}`,
      service,
      version,
      status: 'success',
      timestamp: new Date().toISOString(),
      duration: Math.floor(Math.random() * 100) + 20,
    };

    deployments.push(deployment);

    res.status(201).json({
      success: true,
      data: deployment,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ error }, 'Failed to create deployment');
    res.status(500).json({
      success: false,
      error: {
        code: 'DEPLOYMENT_CREATE_FAILED',
        message: 'Failed to create deployment',
        details: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
