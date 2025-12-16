# PayVerse Backend (Week 11)

Backend service for PayVerse demonstrating technical trade-offs:

- **SQL vs NoSQL** → SQL-oriented design (row-based payments, aggregate queries)
- **REST vs gRPC** → RESTful JSON APIs over HTTP (Express)
- **Redis Cache vs In-Memory Cache** → In-memory cache for low operational overhead in PoC

## Tech Stack

- Node.js 18+
- Express (TypeScript)
- In-memory storage and caching

## Endpoints

Base URL: `http://localhost:4100`

- `GET /health` – Health check
- `POST /api/payments` – Create a payment
- `GET /api/payments` – List payments (filters: `userId`, `region`)
- `PATCH /api/payments/:id/status` – Update payment status
- `GET /api/payments/stats` – Aggregated stats (cached in memory)

## Running Locally

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Postman

Import `postman/payverse-backend.postman_collection.json` to explore the API.
