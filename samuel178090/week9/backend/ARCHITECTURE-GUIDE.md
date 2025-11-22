# 📐 PART 1: ARCHITECTURE EXPLANATION

## System Overview
```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Legacy    │      │  Your Node.js    │      │   React     │
│   System    │─────▶│  Integration     │◀─────│   Frontend  │
│  (Mock API) │      │    Service       │      │     App     │
└─────────────┘      └──────────────────┘      └─────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  Cache (Redis/  │
                     │   In-Memory)    │
                     └─────────────────┘
```

## Component Breakdown

### 1. Legacy System (Mock)
- **What**: JSONPlaceholder or your own mock server
- **Returns**: "Ugly" legacy data (inconsistent formats, old field names)
- **Example endpoint**: GET /posts returns old-style payment data

### 2. Your Node.js Integration Service (THE MAIN PROJECT)
**Responsibilities:**
- Fetch data from legacy API
- Transform it (rename fields, restructure, clean)
- Cache responses (reduce legacy system load)
- Expose modern v2 endpoints
- Handle errors, retries, timeouts
- Version APIs (v1 = pass-through, v2 = transformed)

**Technology Stack:**
- Node.js (Runtime)
- Express.js (Web framework)
- TypeScript (Type safety)
- Axios (HTTP client for fetching legacy data)
- node-cache or Redis (Caching)
- Jest (Testing)
- dotenv (Environment variables)

**Key Endpoints You'll Build:**
- GET /api/v1/payments     → Pass-through to legacy (unchanged)
- GET /api/v2/payments     → Transformed modern data
- GET /api/v2/payments/:id → Single payment, cached
- GET /health              → Service health check

### 3. React Frontend
**Responsibilities:**
- Fetch data from YOUR Node.js service (not legacy directly)
- Display payments/customers in a dashboard
- Show loading/error/success states
- Compare v1 vs v2 data (show transformation)

**Technology Stack:**
- React 18
- Vite (Build tool)
- TypeScript
- Axios (API calls)
- CSS modules (Styling)

### 4. Cache Layer
**Purpose**: Store frequently requested data temporarily
**Options:**
- In-Memory (node-cache) - Simpler, good for learning
- Redis - Production-ready, persistent

## Data Flow Example

**Scenario**: User requests payment data

1. User opens React app → "Show Payments" button
2. React calls: GET http://your-backend.com/api/v2/payments
3. Node.js checks cache:
   ├─ If cached → Return immediately (fast!)
   └─ If not cached:
      ├─ Fetch from legacy: GET jsonplaceholder.typicode.com/posts
      ├─ Transform data (ugly → beautiful)
      ├─ Store in cache
      └─ Return to React
4. React displays data in a table
5. Next request → Returns from cache (no legacy call needed)

## Data Transformation Example

**Legacy Response (v1):**
```json
{
  "id": 1,
  "userId": 10,
  "title": "Payment 12345",
  "body": "Amount: 500 Status: completed"
}
```

**Your Transformed Response (v2):**
```json
{
  "paymentId": 1,
  "customerId": 10,
  "amount": 500,
  "currency": "USD",
  "status": "completed",
  "description": "Payment 12345",
  "createdAt": "2025-11-18T10:30:00Z",
  "metadata": {
    "source": "legacy-system",
    "transformed": true
  }
}
```

# 🗓️ PART 2: 5-DAY BUILD PLAN

## DAY 1: Setup & Basic Backend (3-4 hours)

### Goals:
✅ Setup project structure
✅ Create basic Express server
✅ Fetch data from JSONPlaceholder
✅ Return raw data (no transformation yet)

### 1.1 Create Backend Project (30 min)
```bash
# Create folder
mkdir legacybridge-backend
cd legacybridge-backend

# Initialize Node project
npm init -y

# Install dependencies
npm install express axios dotenv cors
npm install -D typescript @types/node @types/express ts-node-dev

# Initialize TypeScript
npx tsc --init
```

### 1.2 Project Structure (15 min)
```
legacybridge-backend/
├── src/
│   ├── config/
│   │   └── config.ts          # Environment variables
│   ├── services/
│   │   └── legacyService.ts   # Legacy API calls
│   ├── controllers/
│   │   └── paymentController.ts
│   ├── routes/
│   │   └── paymentRoutes.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   ├── utils/
│   │   └── logger.ts
│   └── server.ts              # Main entry point
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

### Day 1 Deliverable:
✅ Basic Express server running
✅ Fetching data from JSONPlaceholder
✅ V1 endpoints working
✅ Health check endpoint

## DAY 2: Data Transformation & V2 Endpoints (4-5 hours)

### Goals:
✅ Create data transformation logic
✅ Build V2 endpoints with clean data
✅ Add error handling
✅ Add retry logic

### Day 2 Deliverable:
✅ Data transformation working
✅ V2 endpoints returning clean data
✅ Error handling middleware
✅ Retry logic implemented

## DAY 3: Caching & Testing (4-5 hours)

### Goals:
✅ Implement caching (in-memory)
✅ Write unit tests
✅ Test coverage report

### Day 3 Deliverable:
✅ Caching implemented
✅ Cache stats endpoint
✅ Unit tests written
✅ Coverage report generated

## DAY 4: React Frontend (4-5 hours)

### Goals:
✅ Setup React + Vite project
✅ Create payment dashboard
✅ Fetch and display data
✅ Handle loading/error states

### Day 4 Deliverable:
✅ React app displaying payments
✅ Loading/error states
✅ Responsive design
✅ API integration working

## DAY 5: Polish & Deploy (3-4 hours)

### Goals:
✅ Add documentation
✅ Create Postman collection
✅ Deploy to cloud
✅ Final testing

### Day 5 Deliverable:
✅ Complete documentation
✅ Postman collection
✅ Deployed URLs
✅ Final demo ready

## Quick Implementation Tips

### Backend Key Files:
1. **legacyService.ts** - Fetch from JSONPlaceholder
2. **transformerService.ts** - Convert legacy → modern
3. **cacheService.ts** - In-memory caching
4. **paymentController.ts** - Handle API requests
5. **server.ts** - Express setup

### Frontend Key Files:
1. **api.ts** - Axios service
2. **PaymentList.tsx** - Display payments
3. **App.tsx** - Main component
4. **types.ts** - TypeScript interfaces

### Testing Strategy:
- Unit tests for transformation logic
- Integration tests for API endpoints
- Frontend component tests
- End-to-end API testing

This architecture demonstrates real-world legacy integration patterns used in fintech companies for modernizing payment systems while maintaining backward compatibility.