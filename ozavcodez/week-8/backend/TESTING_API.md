# Testing the Backend API

## Local Testing

### 1. Start the Backend
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

The server runs at `http://localhost:3000`

### 2. Test Endpoints

#### Health Check
\`\`\`bash
curl http://localhost:3000/api/health
\`\`\`

Expected response:
\`\`\`json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "...",
    "uptime": ...,
    "message": "Service is operational",
    "metrics": { ... }
  },
  "timestamp": "..."
}
\`\`\`

#### List Deployments
\`\`\`bash
curl http://localhost:3000/api/deployments
\`\`\`

#### Get Single Deployment
\`\`\`bash
curl http://localhost:3000/api/deployments/1
\`\`\`

#### Test Error Handling
\`\`\`bash
curl http://localhost:3000/api/deployments/999
\`\`\`

Expected 404 response:
\`\`\`json
{
  "success": false,
  "error": {
    "code": "DEPLOYMENT_NOT_FOUND",
    "message": "Deployment with ID 999 not found"
  },
  "timestamp": "..."
}
\`\`\`

## Testing with Postman

1. Open Postman
2. Import `backend/postman-collection.json`
3. Run the requests in the collection

## Automated Testing

Run the test suite:
\`\`\`bash
npm run test
\`\`\`

This validates:
- Response format consistency
- HTTP status codes
- Error handling
- API contract compliance
