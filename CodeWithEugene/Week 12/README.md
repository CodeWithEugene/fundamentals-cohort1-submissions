## WaveCom Notification Delivery System (Week 12)

### Problem Overview

WaveCom needs a **scalable, fault-tolerant Notification Delivery System** that can handle **up to 50,000 notifications per minute** for enterprise clients (banks, fintechs, logistics).  
The system must:

- **Create notification jobs** (email, SMS, push)
- **Queue messages** for asynchronous delivery
- **Dispatch notifications via mock providers**
- Implement **retry logic and failure handling**
- Expose APIs for:
  - **Creating notification requests**
  - **Checking status of a notification**
  - **Retrieving list of all jobs**
- Provide a **minimal frontend dashboard** to:
  - **Send notification jobs**
  - **Observe job status changes** in near real-time (polling)

Tech stack:

- **Backend**: Node.js (Express + TypeScript)
- **Frontend**: React + Vite
- **Database**: MongoDB (Mongoose)
- **Queue**: RabbitMQ

---

### High-Level Architecture

- **WaveCom API Service (Express)**
  - Accepts notification requests
  - Persists jobs to MongoDB
  - Publishes messages to RabbitMQ
  - Exposes REST APIs for job status + listing

- **Notification Worker (Node process)**
  - Subscribes to RabbitMQ queue
  - Pulls jobs and calls a **mock provider**
  - Updates job status and writes logs
  - Implements **retry with backoff** and marks hard failures

- **MongoDB**
  - `NotificationJob` collection: job lifecycle and metadata
  - `NotificationLog` collection: audit trail of events per job

- **RabbitMQ**
  - Durable queue `notification-jobs`
  - Provides decoupling, buffering, and backpressure between API and workers

- **React-Vite Dashboard**
  - Form to create notification jobs
  - Table showing latest jobs and status
  - Uses **polling** to approximate real-time updates

#### Architecture Diagram

You can view/edit the architecture diagram here:  
**Architecture Diagram (draw.io)**: `[WaveCom Notification System Diagram](https://app.diagrams.net/)`

Diagram (conceptual description):

- **Client (React Dashboard)** → **WaveCom API (Express)** → **MongoDB**
- **WaveCom API (Express)** → **RabbitMQ Queue (notification-jobs)**
- **Notification Worker(s)** ← **RabbitMQ Queue** → **Mock Providers**
- **Notification Worker(s)** → **MongoDB (jobs + logs)**

---

### Components and Responsibilities

- **Express API Service (`Week 12/backend`)**
  - `src/server.ts`  
    - Boots Express, connects to MongoDB
    - Mounts `/api/notifications` routes
    - Provides `/health` endpoint
  - `src/routes/notificationRoutes.ts`  
    - `POST /api/notifications` – create job and enqueue
    - `GET /api/notifications/:id` – fetch job status
    - `GET /api/notifications` – list recent jobs
  - `src/services/notificationService.ts`  
    - Business logic for creating and reading jobs
    - Publishes to RabbitMQ via `notification-jobs` queue
  - `src/config/env.ts` / `db.ts` / `rabbitmq.ts`  
    - Centralized config (port, URIs, queue name, max attempts)
    - MongoDB and RabbitMQ connection helpers

- **Worker Service (`src/worker/notificationWorker.ts`)**
  - Dedicated Node process
  - Connects to MongoDB + RabbitMQ
  - Uses `channel.prefetch(50)` for **backpressure**
  - For each message:
    - Loads job from DB
    - Moves status → `sending`
    - Calls `mockSendNotification`
    - On success: status → `sent`
    - On failure:
      - Increment `attempts`
      - If `attempts >= maxAttempts`: mark `failed`
      - Else: mark `retrying`, **schedule delayed requeue**

- **MongoDB Models**
  - `NotificationJob`
    - Fields: `type`, `recipient`, `message`, `metadata`, `status`, `attempts`, `maxAttempts`, `lastError`, timestamps
    - Status states: `pending` → `queued` → `sending` → (`sent` | `retrying` | `failed`)
  - `NotificationLog`
    - Fields: `jobId`, `event`, `details`, `createdAt`
    - Events: `created`, `queued`, `sending`, `sent`, `retry_scheduled`, `failed`

- **React-Vite Frontend (`Week 12/frontend`)**
  - `App.tsx`
    - Form to submit a notification (`type`, `recipient`, `message`)
    - Uses `axios` to call `/api/notifications`
    - Polls `/api/notifications` every few seconds to refresh table
  - `styles.css`
    - Simple, modern UI styling for cards, table, statuses
  - `vite.config.ts`
    - Dev server proxy from `/api` → `http://localhost:4200` (backend)

---

### API Design

Base URL (dev): `http://localhost:4200`

- **Create Notification**
  - **URL**: `POST /api/notifications`
  - **Body**:
    - `type`: `"email" | "sms" | "push"`
    - `recipient`: `string`
    - `message`: `string`
    - `metadata` (optional): `object`
  - **Response** `201 Created`:
    - `{ id, status, attempts, maxAttempts, createdAt }`

- **Get Notification Status**
  - **URL**: `GET /api/notifications/:id`
  - **Response** `200 OK`:
    - Full `NotificationJob` document (JSON)
  - **Errors**:
    - `404` if job not found

- **List Jobs**
  - **URL**: `GET /api/notifications`
  - **Response** `200 OK`:
    - Array of latest jobs (sorted by `createdAt` desc, limited to 100)

---

### Database Schema

- **Collection: `NotificationJob`**
  - **Fields**:
    - `type`: `"email" | "sms" | "push"`
    - `recipient`: `string`
    - `message`: `string`
    - `metadata`: `object | null`
    - `status`: `"pending" | "queued" | "sending" | "sent" | "failed" | "retrying"`
    - `attempts`: `number`
    - `maxAttempts`: `number`
    - `lastError`: `string | null`
    - `createdAt`: `Date`
    - `updatedAt`: `Date`

- **Collection: `NotificationLog`**
  - **Fields**:
    - `jobId`: `string` (indexed)
    - `event`: `string`
    - `details`: `object | null`
    - `createdAt`: `Date`

---

### Queueing Model & Retry Flow

- **Queueing Model**
  - API service publishes messages to **RabbitMQ** queue: `notification-jobs`
  - Messages contain minimal payload: `{ jobId }`
  - Workers `consume` the queue with `prefetch(50)` to avoid overload
  - Queue is **durable** and messages are **persistent** to survive restarts

- **Retry Flow**
  - Worker loads job and attempts delivery via `mockSendNotification`
  - If call **succeeds**:
    - Job status → `sent`
    - `NotificationLog`: `sent`
  - If call **fails**:
    - Increment `attempts`
    - If `attempts >= maxAttempts`:
      - Status → `failed`
      - `NotificationLog`: `failed` with error details
    - Else:
      - Status → `retrying`
      - `NotificationLog`: `retry_scheduled`
      - Compute delay: `delayMs = 1000 * attempts` (simple linear backoff)
      - After delay, publish `{ jobId }` back onto the queue
  - Messages are **acked** only once they are either:
    - Successfully sent, or
    - Scheduled for another attempt or marked failed.

This implements **at-least-once delivery** with **bounded retries**.

---

### Scaling Strategy

- **Horizontal Scaling of API Service**
  - The Express API is **stateless**; any instance can handle any request.
  - Jobs are stored in MongoDB and delivery is offloaded to RabbitMQ + workers.
  - Can run many API instances behind a load balancer to absorb spikes in write traffic.

- **Horizontal Scaling of Workers**
  - The main lever for throughput is the **number of worker processes**.
  - Each worker has a `prefetch` limit (here 50), which can be tuned.
  - For target **50,000 notifications/minute ≈ 833/sec**:
    - If each worker can process ~50 notifications/sec, you need ~17 workers.
    - In practice you’d deploy **tens of workers** across multiple containers/VMs.

- **RabbitMQ**
  - Acts as a **buffer** between bursty producers and consumers.
  - Queue depth can temporarily grow during spikes while workers catch up.
  - Can scale with **multiple queues** and **consumer groups** if needed.

- **MongoDB**
  - Can be scaled with **replica sets** (for HA) and **sharding** as write volume grows.
  - Typical access patterns (insert job, update status, sequential reads) are easy to scale.

---

### Fault Tolerance Strategy

- **Decoupling via Message Queue**
  - If workers go down, the API still accepts jobs and pushes to RabbitMQ.
  - Once workers are restored, they drain backlog from the queue.

- **Retry + Backoff**
  - Transient provider failures don’t immediately fail jobs.
  - Retries with backoff reduce pressure on flaky dependencies.
  - `maxAttempts` bound prevents infinite retry loops.

- **Durable Messaging & Persistent State**
  - MongoDB stores jobs and logs durably.
  - RabbitMQ durable queues and persistent messages preserve work across restarts.

- **Graceful Degradation**
  - Under heavy load, the **primary degradation** is:
    - Longer queue times before delivery
    - Increased backlog size in RabbitMQ
  - API can still:
    - Accept new jobs
    - Return job status
  - Workers process as fast as resources allow without taking down the API.

---

### Frontend Behavior (Polling-Based Real-Time)

- The dashboard:
  - Sends new jobs via `POST /api/notifications`
  - Polls `GET /api/notifications` every few seconds
  - Renders a table with:
    - Truncated job ID
    - Type, recipient, status, attempts, created time
  - Status badges visually differentiate `pending`, `queued`, `sending`, `sent`, `retrying`, `failed`.

For a production system, this could be upgraded to **WebSockets** or **Server-Sent Events**, but polling is simple, robust, and adequate for the exercise.

---

### Design Defense

#### Why this architecture?

- **Queue-based design** is a natural fit for notification delivery:
  - Creation (API) and delivery (worker) are decoupled.
  - The API stays responsive even if downstream providers are slow.
- **MongoDB** is a good choice for:
  - Flexible job schemas and metadata for different notification types.
  - High write throughput and easy horizontal scaling.
- **RabbitMQ** is a mature, battle-tested queue:
  - Supports durable queues, acknowledgments, prefetch/backpressure.
  - Allows many independent workers to scale out horizontally.
- **Separate worker process**:
  - Enables independent scaling and isolation from API SLA.
  - Reduces blast radius of provider issues.

#### How will it handle 50,000 notifications/min?

- At 50,000/min (\(\approx 833\) per second):
  - Sizing for **workers**:
    - Assume each worker can process ~50 notifications/second (20ms avg).
    - You need around 17 workers; round up to **20–30 workers** for headroom.
  - **RabbitMQ**:
    - Handles high message rates with proper tuning.
    - Acts as a buffer; temporary spikes increase queue depth but not API latency.
  - **MongoDB**:
    - Optimized for writes; each job insert/update is lightweight.
    - With indexes on job ID and timestamps, listing and lookups remain fast.

The architecture scales primarily by **adding more worker instances** and **horizontally scaling the API and database** as needed.

#### How does the system degrade gracefully under load?

- When notifications outpace worker throughput:
  - **Queue depth grows**, increasing delivery latency rather than failing requests.
  - API still responds quickly because it only writes to MongoDB and RabbitMQ.
- If providers become flaky:
  - Jobs transition into `retrying` state with backoff.
  - Only after exhausting `maxAttempts` do jobs become `failed`.
- If MongoDB is slow:
  - API endpoints become the bottleneck, but:
    - There is a clear failure mode (5xx) instead of silent loss.
    - Queue + worker still protect against provider slowness.

Overall, the system prioritizes **accepting and persisting work** over immediate delivery when constrained.

#### Potential bottlenecks and mitigations

- **Bottleneck: Single RabbitMQ queue / broker**
  - Mitigation:
    - Configure RabbitMQ clusters / mirrored queues for HA.
    - Partition by notification type (e.g., `email-jobs`, `sms-jobs`, `push-jobs`).

- **Bottleneck: MongoDB write throughput**
  - Mitigation:
    - Use **replica sets** + **sharding**.
    - Batch certain log writes or reduce log verbosity.
    - Add proper indexes and optimize queries.

- **Bottleneck: Worker throughput**
  - Mitigation:
    - Increase worker count (more pods/containers/instances).
    - Tune `prefetch` and concurrency settings.
    - Optimize provider calls or use connection pooling.

- **Bottleneck: API layer**
  - Mitigation:
    - Run multiple stateless API instances behind a load balancer.
    - Implement rate limiting / quotas for noisy tenants.

---

### Running the System (Local)

- **Backend**
  - `cd Week 12/backend`
  - `npm install`
  - Ensure MongoDB and RabbitMQ are running locally
  - `npm run dev` – starts API on `http://localhost:4200`
  - In another terminal: `npm run worker` – starts the worker process

- **Frontend**
  - `cd Week 12/frontend`
  - `npm install`
  - `npm run dev` – opens React app (default `http://localhost:5174`)
  - The Vite dev server proxies `/api` calls to `http://localhost:4200`

---

### Postman Collection (Optional)

You can create a Postman collection with the following endpoints:

- `POST /api/notifications`
- `GET /api/notifications/:id`
- `GET /api/notifications`

Export it as `WaveCom-Notifications.postman_collection.json` into the `backend` folder if needed.


