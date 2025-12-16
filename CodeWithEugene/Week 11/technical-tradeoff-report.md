## PayVerse – Technical Trade-Off Report (Week 11)

### 1. Problem Statement

PayVerse is a distributed payments platform processing high-volume transactions across multiple regions. The Core Services team must evolve the platform while balancing:

- **Scalability** across regions and traffic spikes
- **Cost** of infrastructure and operations
- **Developer velocity** for a growing team
- **Maintainability** of code and architecture
- **Reliability** for mission-critical payments

For this challenge, we implement a small proof-of-concept service and UI, while explicitly making and justifying three technical decisions:

1. SQL vs NoSQL
2. REST vs gRPC
3. Redis Cache vs In-Memory Cache

The implementation is intentionally small but modeled as if it would later scale to production.

---

### 2. Decision 1 – SQL vs NoSQL

#### Options

- **SQL (relational)** – e.g., PostgreSQL, MySQL
- **NoSQL (document / key-value / wide-column)** – e.g., MongoDB, DynamoDB, Redis

#### Trade-off Table

| Aspect                | SQL (Chosen)                                             | NoSQL                                                   |
|-----------------------|----------------------------------------------------------|---------------------------------------------------------|
| Data model            | Strongly structured, schemas, foreign keys              | Flexible schemas, embedded documents                    |
| Consistency model     | Strong ACID semantics (typical)                         | Often tunable / eventual consistency                    |
| Querying & analytics  | Powerful joins, aggregates, window functions            | Simple key-based queries; complex analytics harder      |
| Transactions          | Multi-row, multi-table transactions are first-class     | Limited / per-partition transactions in many systems    |
| Evolution             | Schema migrations required, but predictable             | Schemaless but can drift; versioning logic in code      |
| Operational maturity  | Very mature ecosystem, tooling, and observability       | Varies across vendors; some are managed-only            |

#### Justification

For **payments**, the data model is highly relational and audit-heavy:

- Payments often join with users, accounts, ledgers, and reconciliations
- Strict consistency is more important than write flexibility
- Downstream analytics teams need SQL-friendly schemas

**Decision:** For PayVerse core payments, we favor **SQL** as the primary source of truth.

In this PoC we do **not** connect to a real database, but we:

- Model payments in a **row-like TypeScript type** (`Payment`) with columns you would expect in a relational table.
- Implement queries in `PaymentService` that look like simple SQL `SELECT ... WHERE` and aggregation logic similar to `SUM`/`COUNT GROUP BY status`.
- Keep the service layer clean so that swapping the in-memory array for a real SQL repository would be straightforward.

---

### 3. Decision 2 – REST vs gRPC

#### Options

- **REST over HTTP+JSON (Chosen)**
- **gRPC (HTTP/2 + Protobuf)**

#### Trade-off Table

| Aspect                | REST (Chosen)                                           | gRPC                                                    |
|-----------------------|---------------------------------------------------------|---------------------------------------------------------|
| Client compatibility  | Works everywhere (browsers, mobile, curl/Postman)      | Great for service-to-service; browsers need gateway     |
| Tooling               | Very rich (Postman, curl, browser devtools)            | Excellent for backend, less direct for browsers         |
| Payload format        | Human-readable JSON                                     | Compact binary Protobuf                                 |
| API evolution         | URI + JSON versioning; very familiar                    | Protobuf-compatible, but more ceremony                  |
| Latency & throughput  | Higher overhead, but OK for many fintech workloads     | Lower overhead; better for high-QPS microservice RPCs   |
| Developer onboarding  | Almost every engineer knows REST                       | Requires more infra & protocol knowledge                |

#### Justification

For an **external-facing API + frontend** scenario:

- The frontend is a React SPA running in browsers – REST+JSON integrates directly.
- Postman collections and HTTP tooling are **first-class** for REST.
- The platform may later adopt gRPC internally for service-to-service, but the edge API can stay REST.

**Decision:** Expose PayVerse’s public payment service as **RESTful JSON APIs**.

In the PoC:

- Endpoints live under `/api` and follow typical REST patterns:
  - `POST /api/payments` – create a payment
  - `GET /api/payments` – list/filter payments
  - `PATCH /api/payments/:id/status` – update payment status
  - `GET /api/payments/stats` – aggregate stats
- A Postman collection (`postman/payverse-backend.postman_collection.json`) documents the API.

---

### 4. Decision 3 – Redis Cache vs In-Memory Cache

#### Options

- **Redis cache** – networked, shared, persistent/volatile
- **In-memory cache (Chosen)** – per-instance process memory

#### Trade-off Table

| Aspect                | Redis                                                   | In-Memory Cache (Chosen)                                |
|-----------------------|---------------------------------------------------------|---------------------------------------------------------|
| Topology              | Shared, central (or clustered) store                   | Local to each service instance                          |
| Horizontal scaling    | Cache survives restarts; shared across instances       | Each instance has its own cache; potential duplication  |
| Latency               | Network hop; usually very fast but non-zero            | In-process; extremely fast                              |
| Operational overhead  | Requires provisioning, monitoring, backups             | Almost zero; just code                                   |
| Failure modes         | Redis outages affect all nodes but can be mitigated    | Cache lost on restart, but recomputed from source       |
| Cost                  | Extra infra cost                                       | No additional infra cost                                |

#### Justification

For a **learning PoC** and small-scale workloads:

- The complexity of running Redis is not justified.
- The biggest risk is **overcomplicating** the stack and slowing down learning.
- In-memory cache is sufficient to demonstrate trade-offs and caching patterns.

**Decision:** Use a simple **in-memory cache** with TTL for aggregate stats.

In the PoC backend:

- `InMemoryCache` in `src/services/cache.service.ts` stores `payment-stats` for a short TTL.
- `GET /api/payments/stats`:
  - First checks the cache.
  - On cache miss, recomputes aggregates from the in-memory payment list and writes them back to the cache.
  - Response shows whether it was served from cache (`cached: true/false`).

The **Stats** page in the frontend visually surfaces this by showing a cache indicator.

---

### 5. Architecture Diagram

High-level logical architecture:

```text
[ React (Vite, TypeScript) ]
        |
        |  REST/JSON over HTTP
        v
[ PayVerse Backend (Express + TS) ]
        |
        |  In-process function calls
        v
[ PaymentService ]  -- computes -->  [ PaymentStats ]
        ^                               |
        | reads/writes                  |
        |                               v
[ In-memory Payments Array ]     [ InMemoryCache (TTL) ]
```

Notes:

- The **backend** is designed as if it would later talk to a relational database, but currently uses an in-memory array.
- The **frontend** treats the backend as a REST API; it does not know or care whether data is cached or stored in SQL.

---

### 6. Implementation Summary

#### Backend – `payverse-backend`

- **Tech:** Node.js, Express, TypeScript.
- **Structure:**
  - `src/config/env.ts` – environment configuration.
  - `src/types/payment.ts` – SQL-like `Payment` model and `PaymentStats` type.
  - `src/services/payment.service.ts` – business logic; simulates SQL-style queries and aggregates.
  - `src/services/cache.service.ts` – generic in-memory cache with TTL.
  - `src/controllers/payment.controller.ts` – request validation, error handling, and mapping to services.
  - `src/routes/payment.routes.ts` – REST endpoints under `/api`.
  - `src/server.ts` – Express app setup (CORS, Helmet, JSON body parsing).

- **Key endpoints:**
  - `POST /api/payments` – create a payment (demonstrates structured write path akin to `INSERT`).
  - `GET /api/payments` – list payments, optionally filtered by `userId` or `region` (SQL-style filtering).
  - `PATCH /api/payments/:id/status` – update payment status, similar to `UPDATE`.
  - `GET /api/payments/stats` – compute aggregate metrics; uses in-memory cache.

- **Error handling:**
  - 400 for invalid/missing fields.
  - 404 for unknown payment ID.
  - 500 for unexpected errors.

- **Postman:**
  - `postman/payverse-backend.postman_collection.json` documents and tests the API.

#### Frontend – `payverse-frontend`

- **Tech:** React, Vite, TypeScript, React Router, Axios.
- **Pages:**
  1. `PaymentsPage` – lists payments, with loading and error states.
     - Button to **simulate a payment** (calls `POST /api/payments`).
     - Table rendering **REST + SQL** style data (amount, currency, status, region, createdAt).
  2. `StatsPage` – shows aggregate stats, with loading and error states.
     - Displays total volume, total count, and counts per status.
     - Highlights **cache behavior** via a cached/not-cached indicator.

- **Service layer:** `src/services/api.ts`
  - Encapsulates REST calls, making it easy to swap the backend implementation later.

---

### 7. How the Trade-Offs Show Up in Code

1. **SQL vs NoSQL**
   - `Payment` is modeled with fixed columns and strong typing.
   - `PaymentService.computeStats()` behaves like SQL aggregates.
   - Filters on `userId` and `region` mimic `WHERE` clauses.

2. **REST vs gRPC**
   - All communication uses **HTTP + JSON**.
   - The React app calls `/api/...` endpoints directly with Axios.
   - The Postman collection is a first-class artifact for experimentation.

3. **Redis vs In-Memory Cache**
   - `InMemoryCache` is a generic TTL cache living in the backend process.
   - It exposes the **behavior** of a cache (hit/miss semantics) without infra.
   - The Stats page shows a user-facing hint (`cached: true/false`).

---

### 8. Future Evolution

If PayVerse were to move beyond the PoC:

- **Swap in SQL:**
  - Replace the in-memory array with a repository using PostgreSQL.
  - Keep `PaymentService` API stable so callers don’t change.

- **Introduce Redis:**
  - Replace `InMemoryCache` with a Redis-backed implementation using the same interface.
  - Reuse keys and TTL strategy; only implementation changes.

- **Add gRPC internally:**
  - Keep the REST API for external clients.
  - Add a gRPC service for internal microservices that need low-latency, strongly typed RPCs.

These evolutions are intentionally straightforward because the PoC already separates **transport** (REST), **domain model** (SQL-style payments), and **caching strategy** (in-memory abstraction).

