import { Router } from 'express';
import { getMetricsText } from '../utils/metrics.js';

const router = Router();

router.get('/', (req, res) => {
  res.set('Content-Type', 'text/plain; version=0.0.4');
  res.send(getMetricsText());
});

export default router;
