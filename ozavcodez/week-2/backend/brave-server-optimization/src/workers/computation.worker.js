import { parentPort } from 'worker_threads';
import { heavyDataProcessing } from '../utils/heavyComputation.js';

// Listen for messages from the main thread
parentPort.on('message', (data) => {
  try {
    console.log('Worker: Processing data in background thread...');
    
    const { iterations = 40 } = data;
    const result = heavyDataProcessing(data, iterations);
    
    // Send result back to main thread
    parentPort.postMessage({ success: true, result });
  } catch (error) {
    console.error('Error in worker:', error);
    parentPort.postMessage({ 
      success: false, 
      error: error.message
    });
  }
});