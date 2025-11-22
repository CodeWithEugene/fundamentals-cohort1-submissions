import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { getPayments, getPaymentById } from './controllers/paymentsController';
import { getCustomers, getCustomerById } from './controllers/customersController';
import { createRefund, getRefunds } from './controllers/refundController';
import { sendNotification, getNotifications } from './controllers/notificationController';
import { transferMoney, payBill, getTransactionHistory, getAccountBalance } from './controllers/transactionController';
import { requireAuth } from './middleware/authMiddleware';
import { getAllUsers, updateUserStatus, getAllTransactions, getSystemStats, createUser, deleteUser, reverseTransaction, requireAdmin } from './controllers/adminController';
import { createInitialAdmin } from './utils/initAdmin';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

// Security check: require a JWT secret in production
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required in production');
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

app.use(cors({
  origin: 'https://legacybrg.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enable pre-flight across-the-board
app.options('*', cors());
app.use(cookieParser());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API v2 routes
app.get('/v2/payments', getPayments);
app.get('/v2/payments/:id', getPaymentById);
app.get('/v2/customers', getCustomers);
app.get('/v2/customers/:id', getCustomerById);
app.post('/v2/refunds', createRefund);
app.get('/v2/refunds', getRefunds);
app.post('/v2/notifications', sendNotification);
app.get('/v2/notifications', getNotifications);
app.post('/v2/transfer', requireAuth, transferMoney);
app.post('/v2/bills', requireAuth, payBill);
app.get('/v2/transactions', requireAuth, getTransactionHistory);
app.get('/v2/balance', requireAuth, getAccountBalance);

// Admin routes
app.get('/v2/admin/users', requireAuth, requireAdmin, getAllUsers);
app.put('/v2/admin/users/:userId', requireAuth, requireAdmin, updateUserStatus);
app.post('/v2/admin/users', requireAuth, requireAdmin, createUser);
app.delete('/v2/admin/users/:userId', requireAuth, requireAdmin, deleteUser);
app.get('/v2/admin/transactions', requireAuth, requireAdmin, getAllTransactions);
app.post('/v2/admin/transactions/:transactionId/reverse', requireAuth, requireAdmin, reverseTransaction);
app.get('/v2/admin/stats', requireAuth, requireAdmin, getSystemStats);

// Auth (mock) - development/demo only
import { signup, login, me, refresh, logout } from './controllers/authController';
import { subscribe } from './controllers/subscribeController';
app.post('/auth/signup', signup);
app.post('/auth/login', login);
app.post('/auth/refresh', refresh);
app.post('/auth/logout', logout);
app.get('/auth/me', requireAuth, me);

// Simple subscription endpoint used by frontend pricing CTA
app.post('/v2/subscribe', subscribe);

// Payment actions
import { refundPayment } from './controllers/paymentsController';
import { notifyCustomer } from './controllers/customersController';
app.post('/v2/payments/:id/refund', refundPayment);
app.post('/v2/customers/:id/notify', notifyCustomer);

// Legacy compatibility routes
app.get('/api/payments', getPayments);
app.get('/api/customers', getCustomers);

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await createInitialAdmin();
  });
}

export default app;