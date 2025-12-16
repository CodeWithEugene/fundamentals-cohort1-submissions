import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { createApolloServer, getApolloMiddleware } from './graphql';

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  // WebSocket server for GraphQL subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
  }));

  // Body parser
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Create Apollo Server
  const apolloServer = await createApolloServer(httpServer, wsServer);
  await apolloServer.start();

  // GraphQL endpoint
  app.use('/graphql', getApolloMiddleware(apolloServer));

  // Start server
  httpServer.listen(config.port, () => {
    console.log(`🚀 Server ready at http://localhost:${config.port}`);
    console.log(`📡 GraphQL endpoint: http://localhost:${config.port}/graphql`);
    console.log(`🔌 WebSocket server ready for subscriptions`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});





