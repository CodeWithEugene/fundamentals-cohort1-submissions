import express from 'express';
import { heavyDataProcessing } from '../utils/heavyComputation.js';

const router = express.Router();

router.post('/process-data', (req, res) => {
  const startTime = Date.now();
  
  try {
    const { iterations = 40 } = req.body;
    
    console.log('⚠️  BLOCKING: Running heavy computation on main thread...');
    
    // This BLOCKS the Event Loop!
    const result = heavyDataProcessing(req.body, iterations);
    
    const duration = Date.now() - startTime;
    
    res.status(200).json({
      success: true,
      result,
      duration: `${duration}ms`,
      warning: 'This endpoint blocks the Event Loop!',
      threadInfo: 'Running on Main Thread'
    });
  } catch (error) {
    console.error('Error in unoptimized route:', error);
    res.status(500).json({ 
      error: 'Processing failed', 
      message: error.message
    });
  }
});

export default router;