require('dotenv').config();
const { createApp, Database, RedisClient } = require('./src/app');


async function startServer() {
  try {
    // Initialize database
    const db = new Database();
    
    // Initialize Redis
    const redisClient = new RedisClient();
    
    // Create Express app
    const app = createApp(db, redisClient);
    
    const PORT = process.env.PORT || 3000;
    
    const server = app.listen(PORT, () => {
      console.log('='.repeat(60));
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🕐 Started at: ${new Date().toISOString()}`);
      console.log('='.repeat(60));
    });
    
    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        await db.close();
        await redisClient.disconnect();
        process.exit(0);
      });
    });
    
    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        await db.close();
        await redisClient.disconnect();
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = { createApp, Database, RedisClient };