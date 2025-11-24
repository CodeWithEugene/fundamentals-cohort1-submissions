const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Cart Service is running!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Cart Service running on port ${PORT}`);
});