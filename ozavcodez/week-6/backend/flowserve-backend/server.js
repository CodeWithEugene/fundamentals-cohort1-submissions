const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(logger);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to FlowServe API' });
});

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;