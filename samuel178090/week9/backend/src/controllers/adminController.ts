import { Request, Response } from 'express';
import * as db from '../services/db';
import bcrypt from 'bcryptjs';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    email: string;
  };
}

// Admin middleware check
const requireAdmin = (req: any, res: Response, next: any) => {
  const user = db.getUserById(req.user?.sub);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const data = db.readData();
    const users = Object.values(data.users || {}).map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
      status: 'active',
      balance: Math.floor(Math.random() * 100000) + 10000, // Mock balance
      lastLogin: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 7),
      created: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 30)
    }));

    res.json({
      success: true,
      data: users,
      meta: { total: users.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status, role } = req.body;

    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user (mock - in real app would update database)
    const updatedUser = { ...user, status, role };

    res.json({
      success: true,
      data: updatedUser,
      message: `User ${status === 'suspended' ? 'suspended' : 'activated'} successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    // Mock comprehensive transaction data
    const transactions = [
      {
        id: 'txn_001',
        type: 'transfer',
        sender: 'user@example.com',
        recipient: 'john@example.com',
        amount: 1500000,
        currency: 'ngn',
        status: 'completed',
        reference: 'TXN001ABC',
        created: Math.floor(Date.now() / 1000) - 3600
      },
      {
        id: 'bill_002',
        type: 'bill_payment',
        payer: 'sam@example.com',
        provider: 'AEDC',
        amount: 850000,
        currency: 'ngn',
        status: 'successful',
        reference: 'BILL002XYZ',
        created: Math.floor(Date.now() / 1000) - 7200
      },
      {
        id: 'txn_003',
        type: 'refund',
        amount: 500000,
        currency: 'ngn',
        status: 'processing',
        reference: 'REF003DEF',
        created: Math.floor(Date.now() / 1000) - 1800
      }
    ];

    res.json({
      success: true,
      data: transactions,
      meta: {
        total: transactions.length,
        totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
  }
};

export const getSystemStats = async (req: Request, res: Response) => {
  try {
    const data = db.readData();
    const userCount = Object.keys(data.users || {}).length;

    const stats = {
      totalUsers: userCount,
      activeUsers: Math.floor(userCount * 0.8),
      totalTransactions: 1247,
      totalVolume: 245000000, // ₦2.45M in kobo
      todayTransactions: 45,
      todayVolume: 12500000, // ₦125K in kobo
      pendingTransactions: 3,
      failedTransactions: 2,
      systemUptime: '99.9%',
      lastUpdated: Math.floor(Date.now() / 1000)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch system stats' });
  }
};

export const createUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    const adminUser = req.user?.sub ? db.getUserById(req.user.sub) : null;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Only existing admin can create new admin
    if (role === 'admin' && adminUser?.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can create admin accounts' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const id = `u_${Date.now()}`;
    const passwordHash = await bcrypt.hash(password, 10);
    
    const newUser = db.createUser({
      id,
      email,
      passwordHash,
      name,
      role: role || 'user'
    });

    res.json({
      success: true,
      data: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // In real app, would delete from database
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
};

export const reverseTransaction = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { transactionId } = req.params;
    const { reason } = req.body;

    const reversal = {
      id: `rev_${Date.now()}`,
      originalTransaction: transactionId,
      reason: reason || 'Admin reversal',
      status: 'completed',
      processedBy: req.user?.email,
      created: Math.floor(Date.now() / 1000)
    };

    res.json({
      success: true,
      data: reversal,
      message: 'Transaction reversed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to reverse transaction' });
  }
};

export { requireAdmin };