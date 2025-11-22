# LegacyBridge Backend API

Hey there! 👋 This is my backend service that bridges legacy PHP systems with modern Node.js APIs. I built this to solve real-world integration challenges I've encountered.

## What I Built

This Express.js API transforms legacy data into modern Stripe-like formats with Nigerian Naira (NGN) support. Perfect for fintech applications in Nigeria!

### Key Features I Implemented
- 🔄 **Legacy System Integration** - Connects to old systems via JSONPlaceholder
- 💰 **NGN Currency Support** - All amounts in Nigerian Naira
- 🔐 **JWT Authentication** - Secure login/signup system
- 📊 **Data Transformation** - Legacy → Modern API format
- ⚡ **Caching & Retries** - Performance optimized
- 🧪 **Full Test Coverage** - Jest testing suite
- 🐳 **Docker Ready** - Easy deployment

## 🚀 Live Demo

**Backend API:** https://legacybridge-backend-un5w.onrender.com
**Frontend:** https://legacybrg.netlify.app

### Demo Credentials

**Admin Access:**
```
Email: sam@example.com
Password: mayowa123
Name: Samuel
```

**Regular User Access:**
```
Email: user@example.com
Password: mayowa123
Name: Regular User
```

**Role-Based Features:**
- Admin users see full payment/customer management
- Regular users see limited dashboard with account overview

## Quick Start

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your values

# Development
npm run dev

# Production
npm run build
npm start

# Run tests
npm test
```

## API Endpoints I Created

### Payments
- `GET /v2/payments` - List all payments
- `GET /v2/payments/:id` - Get specific payment
- `POST /v2/refunds` - Process refunds

### Customers  
- `GET /v2/customers` - List all customers
- `GET /v2/customers/:id` - Get specific customer

### Notifications
- `POST /v2/notifications` - Send notifications
- `GET /v2/notifications` - List notifications

### Authentication
- `POST /auth/signup` - Create account
- `POST /auth/login` - Login
- `GET /auth/me` - Get user info
- `POST /auth/refresh` - Refresh token

## Environment Variables

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your_secret_here
FRONTEND_ORIGIN=http://localhost:5173
LEGACY_API_URL=https://jsonplaceholder.typicode.com
CACHE_TTL=300
```

## Deployment

### Render.com
1. Connect this GitHub repo
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables above

### Docker
```bash
docker build -t legacybridge-backend .
docker run -p 3000:3000 legacybridge-backend
```

### Troubleshooting: types & deployment
If you see errors like "Cannot find module '../types/express'" during deployment, it usually means a TypeScript-only import or a local type file was referenced at runtime. Remedies:

- Make runtime imports come from the runtime package: `import { Request, Response } from 'express';` instead of importing from local `../types` files. Use `import type { ... } from './types'` for TS-only imports so they are erased at emit.
- Ensure `tsconfig.json` has `declaration: true` and `declarationMap: true` (already enabled) so build artifacts include type declarations if needed by consumers.
- Use the provided multi-stage Dockerfile (builder + runner) so dev dependencies are used during build but not required at runtime. If you absolutely need `@types` at runtime, move them into `dependencies` (not recommended).


## Testing

```bash
# Run all tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Live API Testing

```bash
# Test live backend
curl https://legacybridge-backend-un5w.onrender.com/health
curl https://legacybridge-backend-un5w.onrender.com/v2/payments
curl https://legacybridge-backend-un5w.onrender.com/v2/customers
```

## Tech Stack I Used
- **Node.js** + **Express** - Server framework
- **TypeScript** - Type safety
- **JWT** - Authentication
- **Axios** - HTTP client
- **Jest** - Testing
- **Docker** - Containerization

## Sample Response

```json
{
  "success": true,
  "data": [
    {
      "id": "pi_000000000000000000000001",
      "object": "payment_intent",
      "amount": 2999,
      "currency": "ngn",
      "status": "succeeded",
      "customer": "cus_00000000000001"
    }
  ]
}
```

Built with ❤️ for modern fintech integration in Nigeria.

---
**Samuel** - Full Stack Developer