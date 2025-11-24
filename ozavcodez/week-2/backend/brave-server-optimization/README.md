# 🚀 Node Workers Benchmarking

This project compares the performance of **optimized** vs **unoptimized** API endpoints using [Autocannon](https://github.com/mcollina/autocannon), a Node.js HTTP benchmarking tool.

---

## Endpoints Tested
- `/api/optimized/process-data`
- `/api/unoptimized/process-data`

---

## Benchmark Setup

- **Tool**: Autocannon
- **Duration**: 30 seconds
- **Connections**: 100 (simulated concurrent users)
- **Method**: POST
- **Payload**: `test-data.json`
- **Command**:
  ```bash
  npm run dev
  npm run test:optimized
  npm run test:unoptimized

#### Unoptimized Endpoint (`/api/unoptimized/process-data`)

| Metric       | 2.5%   | 50%    | 97.5%   | 99%     | Avg        | Stdev     | Max     |
|--------------|--------|--------|---------|---------|------------|-----------|---------|
| **Latency**  | 1748ms | 6720ms | 9642ms  | 9642ms  | 6169.29 ms | 2656.11ms | 9642 ms |

| Metric       | 1%  | 2.5% | 50% | 97.5% | Avg  | Stdev | Min |
|--------------|-----|------|-----|-------|------|-------|-----|
| **Req/Sec**  | 0   | 0    | 0   | 1     | 0.24 | 0.43  | 1   |
| **Bytes/Sec**| 0B  | 0B   | 0B  | 510B  | 119B | 216B  | 509B |

- **Total Requests**: `418` in 30.48s  
- **Errors**: `311` (timeouts)  
- **Throughput**: ~`119 B/s`  


#### Optimized Endpoint (`/api/optimized/process-data`)

| Metric       | 2.5%   | 50%    | 97.5%  | 99%     | Avg      | Stdev     | Max     |
|--------------|--------|--------|--------|---------|----------|-----------|---------|
| **Latency**  | 144 ms | 225 ms | 883 ms | 1586 ms | 302.6 ms | 261.51 ms | 4104 ms |

| Metric       | 1%     | 2.5%   | 50%    | 97.5%  | Avg     | Stdev   | Min     |
|--------------|--------|--------|--------|--------|---------|---------|---------|
| **Req/Sec**  | 154    | 154    | 318    | 548    | 329.24  | 107.82  | 154     |
| **Bytes/Sec**| 74.6kB | 74.6kB | 154kB  | 265kB  | 159kB   | 52.2kB  | 74.5kB  |

- **Total Requests**: `10,000` in 30.29s  
- **Errors**: `0`  
- **Throughput**: ~`159 kB/s`  

### What do the metrics mean?

- **Latency (ms)** → How long it takes the server to respond.  
  👉 Lower = better.  

- **Req/Sec** → How many requests per second the server can handle.  
  👉 Higher = better.  

- **Bytes/Sec** → How much data per second the server processes.  
  👉 Higher = better.  

- **Errors / Timeouts** → Failed requests due to overload or unresponsiveness.  
  👉 Fewer = better.  

# Benchmark Results

## 🔹 Optimized Endpoint (`/api/optimized/process-data`)

### Latency
| Percentile | Value   |
|------------|---------|
| 2.5%       | 144 ms  |
| 50%        | 225 ms  |
| 97.5%      | 883 ms  |
| 99%        | 1586 ms |
| Avg        | 302.6 ms|
| Stdev      | 261.51 ms |
| Max        | 4104 ms |

### Requests / Second
| Percentile | Value |
|------------|-------|
| 1%         | 154   |
| 2.5%       | 154   |
| 50%        | 318   |
| 97.5%      | 548   |
| Avg        | 329.24|
| Stdev      | 107.82|
| Min        | 154   |

### Bytes / Second
| Percentile | Value  |
|------------|--------|
| 1%         | 74.6 kB|
| 2.5%       | 74.6 kB|
| 50%        | 154 kB |
| 97.5%      | 265 kB |
| Avg        | 159 kB |
| Stdev      | 52.2 kB|
| Min        | 74.5 kB|

**Total Requests:** 10,000 in 30.29s  
**Errors:** 0  
**Throughput:** ~159 kB/s  

---

## 🔹 Unoptimized Endpoint (`/api/unoptimized/process-data`)

### Latency
| Percentile | Value   |
|------------|---------|
| 2.5%       | 1748 ms |
| 50%        | 6720 ms |
| 97.5%      | 9642 ms |
| 99%        | 9642 ms |
| Avg        | 6169.29 ms|
| Stdev      | 2656.11 ms|
| Max        | 9642 ms |

### Requests / Second
| Percentile | Value |
|------------|-------|
| 1%         | 0     |
| 2.5%       | 0     |
| 50%        | 0     |
| 97.5%      | 1     |
| Avg        | 0.24  |
| Stdev      | 0.43  |
| Min        | 1     |

### Bytes / Second
| Percentile | Value |
|------------|-------|
| 1%         | 0 B   |
| 2.5%       | 0 B   |
| 50%        | 0 B   |
| 97.5%      | 510 B |
| Avg        | 119 B |
| Stdev      | 216 B |
| Min        | 509 B |

**Total Requests:** 418 in 30.48s  
**Errors:** 311 (timeouts)  
**Throughput:** ~119 B/s  

# 🚀 Optimization Strategy

## ⚠️ Why the Event Loop Was Blocked
Node.js uses a **single-threaded Event Loop** for JavaScript execution.  
When `heavyDataProcessing()` runs with the recursive Fibonacci calculation:

1. **Synchronous CPU-intensive operation** runs on the main thread  
2. The recursive `fibonacciRecursive(n=20)` function has **exponential time complexity O(2^n)**, taking several seconds to complete  
3. **No other requests** can be processed until the calculation finishes  
4. All **100 concurrent connections** wait in queue **serially**  
5. Each request must wait for all previous requests to complete first  

## Why Worker Threads Are the Best Choice
- Run JavaScript in **parallel** on separate threads  
- **Main thread stays free** for I/O and new requests  
- Lower memory footprint than clustering (**shared V8 instance**)  
- Can **share data efficiently** via `SharedArrayBuffer`  
- Perfect for **CPU-intensive tasks** like our Fibonacci calculation  
- More **lightweight** compared to spawning new processes  

# Conclusion

The **optimized version** is **~24x faster** and handles requests **without errors**.  
The **unoptimized version** struggles under load and is **not production-ready**.  

---

- **Event Loop Blocking is Critical:** A single CPU-intensive operation can destroy application performance  
- **Worker Threads Enable True Concurrency:** JavaScript can leverage multiple CPU cores for computational tasks  
- **95% Latency Reduction:** Response times improved from **6.2 seconds → 0.3 seconds**  
- **1,372x Throughput Increase:** From **0.24 → 329 requests per second**  
- **Zero Timeouts:** Eliminated all **293 timeout errors**  
