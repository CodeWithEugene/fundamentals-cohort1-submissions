# DeployHub Backend

Standalone Node.js/Express backend service with observability, metrics, and logging.

## Features

- Express.js API framework
- Structured logging with Pino
- Prometheus metrics collection
- Health check endpoint with system metrics
- Docker containerization
- GitHub Actions CI/CD
- Error handling middleware
- CORS support

## Installation

\`\`\`bash
npm install
\`\`\`

## Configuration

Copy `.env.example` to `.env` and configure:

\`\`\`
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
\`\`\`

## Running Locally

\`\`\`bash
npm run dev
\`\`\`

The server will run on `http://localhost:3000`

## Endpoints

- `GET /health` - Health check with system metrics
- `GET /metrics` - Prometheus metrics
- `GET /api/deployments` - List deployments
- `POST /api/deployments` - Create deployment

## Testing

\`\`\`bash
npm test
\`\`\`

## Docker

\`\`\`bash
docker build -t deployhub-backend .
docker run -p 3000:3000 deployhub-backend
\`\`\`

## Deployment

See `../DEPLOYMENT.md` for production deployment instructions.
