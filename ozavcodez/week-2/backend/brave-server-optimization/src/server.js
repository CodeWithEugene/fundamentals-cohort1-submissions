import express from 'express';
import cors from 'cors';
import unoptimizedRoutes from './routes/unoptimized.js';
import optimizedRoutes from './routes/optimized.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});
// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Info endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Node.js Performance Optimization Demo',
    endpoints: {
      health: 'GET /health',
      unoptimized: 'POST /api/unoptimized/process-data',
      optimized: 'POST /api/optimized/process-data'
    },
    instructions: {
      testUnoptimized: 'npm run test:unoptimized',
      testOptimized: 'npm run test:optimized'
    }
  });
});

// Routes
app.use('/api/unoptimized', unoptimizedRoutes);
app.use('/api/optimized', optimizedRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(` Server running on http://localhost:${PORT}`);
  console.log('='.repeat(60));
  console.log(` Unoptimized endpoint: POST http://localhost:${PORT}/api/unoptimized/process-data`);
  console.log(` Optimized endpoint:   POST http://localhost:${PORT}/api/optimized/process-data`);
  console.log('='.repeat(60));
  console.log('Ready for load testing with autocannon!');
  console.log('Run: npm run test:unoptimized');
  console.log('Then: npm run test:optimized');
  console.log('='.repeat(60));
});