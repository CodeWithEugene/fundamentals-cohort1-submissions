# 🔐 Task Management Platform API

A production-ready REST API with robust JWT authentication, role-based access control (RBAC), and comprehensive security features to prevent OWASP Top 10 vulnerabilities.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Security Features](#security-features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Security Best Practices](#security-best-practices)
- [Testing](#testing)
- [License](#license)

## Features

### Core Functionality
- User registration and authentication
- JWT-based token system (Access + Refresh tokens)
- Role-based access control (User & Admin roles)
- Task CRUD operations with ownership
- Advanced search and filtering with pagination
- Account lockout mechanism
- Token refresh and revocation

### Security Features
- **OWASP A01:2021** - Broken Access Control Prevention
  - Role-based middleware enforcement
  - User-specific data isolation
  - Admin-only privileged operations
  
- **OWASP A03:2021** - Injection Prevention
  - Custom input validation (no external libraries)
  - SQL injection pattern detection
  - XSS attack prevention
  - NoSQL injection safeguards
  
- **Additional Security**
  - Helmet.js for secure HTTP headers
  - Bcrypt password hashing (12 rounds)
  - Redis-based account lockout
  - Token blacklisting
  - Rate limiting via lockout mechanism
  - Request payload size limits

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3 (easily replaceable with PostgreSQL/MySQL)
- **Cache/Session**: Redis
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: Bcrypt
- **Security**: Helmet.js
- **Environment**: dotenv

## 📁 Project Structure

```
task-management-api/
├── src/
│   ├── config/
│   │   ├── database.js          # SQLite database configuration
│   │   └── redis.js              # Redis client setup
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   ├── rbac.js               # Role-based access control
│   │   └── security.js           # Account lockout logic
│   ├── models/
│   │   ├── User.js               # User model with bcrypt
│   │   └── Task.js               # Task model with queries
│   ├── routes/
│   │   ├── auth.js               # Authentication endpoints
│   │   └── tasks.js              # Task management endpoints
│   ├── utils/
│   │   ├── validators.js         # Custom validation functions
│   │   └── tokenUtils.js         # JWT utilities
│   └── app.js                    # Express app configuration
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── README.md                     # Documentation
└── server.js                     # Server entry point
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- Redis server
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <repository-url>

```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=3000
NODE_ENV=development

# Generate strong secrets (at least 32 characters)
JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars

ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

REDIS_HOST=localhost
REDIS_PORT=6379

DB_PATH=./database.sqlite

MAX_LOGIN_ATTEMPTS=3
LOCK_DURATION=1800
```

### Step 4: Start Redis
```bash
# macOS
brew services start redis

# Linux
sudo systemctl start redis

# Docker
docker run -d -p 6379:6379 redis:alpine
```

### Step 5: Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "user"  // or "admin"
}
```

**Response** (201 Created):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Failed Login Response** (401 Unauthorized):
```json
{
  "error": "Invalid credentials",
  "remainingAttempts": 2
}
```

**Account Locked Response** (423 Locked):
```json
{
  "error": "Account locked. Try again in 30 minutes"
}
```

#### 3. Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4. Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

### Task Endpoints

#### 5. Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <access_token>
```

**Access**: User (own tasks) | Admin (all tasks)

**Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Complete project",
      "description": "Finish the API implementation",
      "status": "in-progress",
      "created_at": "2025-10-10T12:00:00.000Z",
      "updated_at": "2025-10-10T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### 6. Create Task
```http
POST /api/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the API implementation",
  "status": "pending"  // or "in-progress", "completed"
}
```

**Access**: User | Admin

**Response** (201 Created):
```json
{
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "user_id": 1,
    "title": "Complete project",
    "description": "Finish the API implementation",
    "status": "pending",
    "created_at": "2025-10-10T12:00:00.000Z",
    "updated_at": "2025-10-10T12:00:00.000Z"
  }
}
```

#### 7. Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <access_token>
```

**Access**: Admin ONLY

**Response** (200 OK):
```json
{
  "message": "Task deleted successfully",
  "taskId": 1
}
```

#### 8. Search Tasks
```http
POST /api/tasks/search
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "query": "project",
  "page": 1,
  "limit": 10
}
```

**Access**: User (own tasks) | Admin (all tasks)

**Response** (200 OK):
```json
{
  "tasks": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### 9. Filter Tasks
```http
POST /api/tasks/filter
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "in-progress",
  "dateFrom": "2025-10-01",
  "dateTo": "2025-10-31",
  "page": 1,
  "limit": 10
}
```

**Access**: User (own tasks) | Admin (all tasks)

**Response** (200 OK):
```json
{
  "tasks": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  },
  "filters": {
    "status": "in-progress",
    "dateFrom": "2025-10-01",
    "dateTo": "2025-10-31"
  }
}
```

## 🔒 Security Best Practices

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Token Management
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days)
- Tokens are blacklisted on logout
- Refresh tokens stored in Redis

### Account Lockout
- 3 failed login attempts trigger lockout
- 30-minute automatic unlock
- Remaining attempts shown in response

### Input Validation
- Custom validators (no external libraries)
- SQL injection pattern detection
- XSS attack prevention
- Null byte removal
- Length restrictions
- Regex DoS prevention

### HTTP Security Headers (Helmet.js)
- Content Security Policy
- XSS Protection
- MIME Type Sniffing Prevention
- Referrer Policy
- Frame Options

## 🧪 Testing

### Manual Testing with cURL

#### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "role": "user"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

#### Create Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Testing the API",
    "status": "pending"
  }'
```

#### Get Tasks
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Testing Security Features

#### Test Account Lockout
```bash
# Try logging in with wrong password 3 times
for i in {1..3}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "WrongPassword123!"
    }'
  echo "\nAttempt $i"
done
```

#### Test SQL Injection Prevention
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com OR 1=1--",
    "password": "anything"
  }'
```

#### Test XSS Prevention
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "<script>alert(\"XSS\")</script>",
    "description": "Testing XSS"
  }'
```

#### Test RBAC (User trying to delete)
```bash
# Login as regular user and try to delete a task
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer USER_ACCESS_TOKEN"
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('user', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK(status IN ('pending', 'in-progress', 'completed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🚨 Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (Validation Error) |
| 401 | Unauthorized (Invalid Credentials) |
| 403 | Forbidden (Insufficient Permissions) |
| 404 | Not Found |
| 423 | Locked (Account Locked) |
| 500 | Internal Server Error |

## 🔧 Troubleshooting

### Redis Connection Issues
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Check Redis logs
tail -f /usr/local/var/log/redis.log
```

### Database Issues
```bash
# Delete and recreate database
rm database.sqlite
npm start  # Database will be recreated automatically
```

### Token Issues
- Ensure JWT secrets are at least 32 characters
- Check token expiry times
- Verify token format (Bearer <token>)
