import express from 'express';
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

function runWorker(data) {
  return new Promise((resolve, reject) => {
    // Create worker thread
    const workerPath = resolve(__dirname, '../workers/computation.worker.js');
    const worker = new Worker(workerPath);

    // Send data to worker
    worker.postMessage(data);

    // Listen for results
    worker.on('message', (result) => {
      if (result.success) {
        resolve(result.result);
      } else {
        reject(new Error(result.error));
      }
      worker.terminate();
    });

    // Handle errors
    worker.on('error', (error) => {
      console.error('Worker error:', error);
      reject(error);
      worker.terminate();
    });

    // Handle unexpected exit
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

router.post('/process-data', async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log(' Offloading to Worker Thread...');
    
    //  the Event Loop is not blocked!
    const result = await runWorker(req.body);
    
    const duration = Date.now() - startTime;
    
    res.status(200).json({
      success: true,
      result,
      duration: `${duration}ms`,
      info: 'This endpoint uses Worker Threads - Event Loop is free!',
      threadInfo: 'Running on Worker Thread'
    });
  } catch (error) {
    console.error('Error in optimized route:', error);
    res.status(500).json({ 
      error: 'Processing failed', 
      message: error.message
    });
  }
});

export default router;
