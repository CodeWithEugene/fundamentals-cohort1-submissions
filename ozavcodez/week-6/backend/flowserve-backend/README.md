# FlowServe Backend API

This is the backend API for FlowServe, a fintech company focused on processing real-time transactions and digital wallet operations.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Logging](#logging)
- [Rate Limiting](#rate-limiting)

## Features

- User management (CRUD operations)
- Transaction processing (credit/debit)
- Request validation
- Error handling middleware
- Pagination support
- Rate limiting
- Logging with Winston
- PostgreSQL database integration with Sequelize ORM

## Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Sequelize** - Promise-based Node.js ORM
- **Joi** - Schema validation
- **Winston** - Logging library
- **Express Rate Limit** - Rate limiting middleware

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v10 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd flowserve-backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_NAME=flowserve_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```

Refer to [.env.example](.env.example) for a template.

## Database Setup

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE flowserve_db;
   ```

2. Run migrations (handled automatically by Sequelize):
   ```bash
   npm run start
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3000 (or the port specified in your .env file).

## API Endpoints

### Users

| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| GET    | `/api/users`   | Get all users         |
| GET    | `/api/users/:id` | Get user by ID      |
| POST   | `/api/users`   | Create a new user     |
| PUT    | `/api/users/:id` | Update user         |
| DELETE | `/api/users/:id` | Delete user         |

### Transactions

| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| GET    | `/api/transactions`   | Get all transactions       |
| GET    | `/api/transactions/:id` | Get transaction by ID    |
| POST   | `/api/transactions`   | Create a new transaction   |
| PUT    | `/api/transactions/:id` | Update transaction       |
| DELETE | `/api/transactions/:id` | Delete transaction       |

### Pagination

Both user and transaction endpoints support pagination:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10)

Example: `/api/users?page=2&limit=5`

## Testing

Run tests with:
```bash
npm test
```

## Logging

The application uses Winston for logging. Logs are stored in the `logs` directory:

- `error.log` - Error logs
- `combined.log` - All logs

In development, logs are also printed to the console.

## Rate Limiting

The API implements rate limiting:

- Maximum 100 requests per 15 minutes per IP address
- Exceeding the limit returns a 429 status code

## Postman Collection

For API testing and documentation, refer to the Postman collection included in this repository.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.