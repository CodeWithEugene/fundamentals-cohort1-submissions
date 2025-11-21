# BACKEND

**Repository:** `legacybridge-backend`
**Project:** LegacyBridge Integration Service
**Stack:** Node.js, Express, TypeScript, Jest, Postman

---

# 1. Overview

This backend service acts as an integration layer between a simulated legacy PHP-style API and a modern microservices ecosystem.
It fetches data from the legacy API, transforms it into modern formats, implements caching, adds error-handling and retry logic, and exposes new API versions such as `/v2/payments`.

The goal is to provide a stable and modern entry point for frontend and microservices while preserving backward compatibility.

---

# 2. Architecture Diagram

![Architecture Diagram](/flow chart.png "Landscape View")


---

# 3. Features

* Integration with legacy API (mock server)
* Data transformation and schema correction
* Retry logic with exponential backoff
* Centralized error handler
* Versioned API endpoints (`/v1` and `/v2`)
* In-memory caching (Redis optional)
* Jest tests with coverage
* Postman documentation included

---

# 4. Tech Stack

* Node.js
* Express
* TypeScript
* Axios + axios-retry
* Node-Cache or Redis
* Jest + Supertest
* Postman

---

# 5. API Endpoints

### **V1 (Backward Compatible)**

These mirror the legacy API responses.

| Method | Endpoint       | Description                     |
| ------ | -------------- | ------------------------------- |
| GET    | `/v1/payments` | Returns raw legacy payment data |

### **V2 (Modernized Endpoints)**

Transformed, validated, modern schemas.

| Method | Endpoint       | Description                              |
| ------ | -------------- | ---------------------------------------- |
| GET    | `/v2/payments` | Returns transformed, cached payment data |

---

# 6. Running Locally

### **1. Clone repository**

```bash
git clone https://github.com/olamarvel/legacybridge-backend.git
cd legacybridge-backend
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Start mock legacy server**

```bash
cd legacy
node index.js
```

### **4. Run backend in dev mode**

```bash
npm run dev
```

### **5. Run tests**

```bash
npm test
```

### **6. Build production**

```bash
npm run build
node dist/index.js
```

---

# 7. Environment Variables

Create a `.env` file:

```
PORT=3000
LEGACY_API_URL=http://localhost:4000
CACHE_TTL=60
```

---

# 8. Testing & Coverage

The project uses Jest + Supertest.

Run tests:

```bash
npm test
```

Check coverage:

```bash
npm run test:coverage
```

Coverage report will be generated at:

```
/coverage/index.html
```

---

# 9. Postman Documentation

A Postman Collection is included inside:

```
/postman_collection.json
```

Contains:

* example requests
* example responses
* error cases
* versioned endpoints

---

# 10. Deployment

Hosted on:
**Backend URL:** *your deployed URL here*

Deployment steps (Render/Railway):

1. Connect repo
2. Set build command: `npm run build`
3. Set start command: `node dist/server.js`
4. Add environment variables

---

# 11. Assumptions

* Legacy API may return incomplete or inconsistent fields
* Response latency may vary
* The new backend should not break v1 behavior
* Caching reduces repeated calls to legacy system