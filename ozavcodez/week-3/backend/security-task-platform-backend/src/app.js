const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const Database = require('./config/database');
const RedisClient = require('./config/redis');
const User = require('./models/User');
const Task = require('./models/Task');
const SecurityMiddleware = require('./middleware/security');
const createAuthRouter = require('./routes/auth');
const createTaskRouter = require('./routes/tasks');

function createApp(db, redisClient) {
  const app = express();
  
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  }));
  
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  }));
  
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  
  // Initialize models
  const userModel = new User(db);
  const taskModel = new Task(db);
  const securityMiddleware = new SecurityMiddleware(redisClient);
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });
  
  // Routes
  app.use('/api/auth', createAuthRouter(userModel, redisClient, securityMiddleware));
  app.use('/api/tasks', createTaskRouter(taskModel));
  
  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
  
  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
  
  return app;
}

module.exports = { createApp, Database, RedisClient };