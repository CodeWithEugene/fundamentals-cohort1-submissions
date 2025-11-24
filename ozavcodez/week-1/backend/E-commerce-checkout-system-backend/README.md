# E-commerce Checkout System - Microservices Architecture

A modern e-commerce checkout system built with microservices architecture, featuring a Node.js backend and React frontend.

## 🏗️ Architecture Overview

https://github.com/ozavcodez/E-commerce-checkout-system-backend/blob/main/architecture-diagram.png

### Microservices Architecture Diagram


### Current Implementation Status

- **Cart Service**: Fully implemented with auth and CRUD operations
- **Frontend**: React app with authentication and cart management
- **Database**: MongoDB integration
- **In Progress**: Authentication service (basic implementation included)
- **Future**: Other microservices (Product, Order, Payment, etc.)

## How to run the Backend

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup (Cart Service)

1. **Clone and navigate to the cart service directory**
   ```bash
    cd carts
   ```

2. **Initialize the project**
   ```bash
   npm init -y
   ```

3. **Install dependencies**
   ```bash
   npm install
   npm install --save-dev nodemon
   ```
4. **Create environment variables**
   ```bash
   # Create .env file
   echo "PORT=3001
   MONGODB_URI=mongodb://localhost:27017/ecommerce-cart
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development" > .env
   ```

5. **Start MongoDB**
   ```bash
   # macOS with Homebrew
   brew services start mongodb/brew/mongodb-community
   
   # Windows
   net start MongoDB
   
   # Linux
   sudo systemctl start mongod
   ```

8. **Start the backend server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3001`

## 🔧 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |

**Register Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Auth Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/cart/add-to-cart` | Add item to cart | Yes |
| GET | `/api/cart/get-cart/:userId` | Get user's cart | No |
| DELETE | `/api/cart/remove/:productId` | Remove item from cart | Yes |
| DELETE | `/api/cart/clear` | Clear entire cart | Yes |

**Add to Cart Request:**
```json
{
  "productId": "1",
  "productName": "Wireless Headphones",
  "price": 99.99,
  "quantity": 1,
  "imageUrl": "https://example.com/image.jpg"
}
```

**Cart Response:**
```json
{
  "userId": "user_id",
  "items": [
    {
      "productId": "1",
      "productName": "Wireless Headphones",
      "price": 99.99,
      "quantity": 2,
      "imageUrl": "https://example.com/image.jpg"
    }
  ],
  "totalAmount": 199.98,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## 🧪 Testing the API

### Using cURL

1. **Register a new user:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

3. **Add item to cart:**
   ```bash
   curl -X POST http://localhost:3001/api/cart/add-to-cart \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "productId": "1",
       "productName": "Test Product",
       "price": 29.99,
       "quantity": 1,
       "imageUrl": "https://example.com/image.jpg"
     }'
   ```

4. **Get cart:**
   ```bash
   curl http://localhost:3001/api/cart/get-cart/USER_ID
   ```

## How to run the frontend

### 1. Clone the Repo

 clone https://github.com/ozavcodez/E-commerce-checkout-system-frontend.git

2. Install Dependencies
npm install

3. Configure Environment Variables

Create a .env file at the root of the project:

VITE_APP_CHECKOUT_BASE_URL=http://localhost:3001/api

4. Run the App
npm run dev

Then visit: http://localhost:5173