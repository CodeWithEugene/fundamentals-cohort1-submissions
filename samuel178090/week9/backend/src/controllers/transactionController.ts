import { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    email: string;
  };
}

export const transferMoney = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { recipientEmail, amount, description, pin } = req.body;
    
    // Validate PIN (demo)
    if (pin !== '1234') {
      return res.status(400).json({ error: 'Invalid PIN' });
    }
    
    // Simulate transfer processing
    const transfer = {
      id: `txn_${Date.now()}`,
      type: 'transfer',
      sender: req.user?.email || 'unknown',
      recipient: recipientEmail,
      amount: parseInt(amount) * 100, // Convert to kobo
      currency: 'ngn',
      description,
      fee: Math.round(parseInt(amount) * 0.015) * 100, // 1.5% fee
      status: 'completed',
      reference: `TXN${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      created: Math.floor(Date.now() / 1000)
    };
    
    res.json({
      success: true,
      data: transfer,
      message: `Transfer of ₦${amount} sent successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Transfer failed'
    });
  }
};

export const payBill = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { billType, provider, accountNumber, amount, pin } = req.body;
    
    // Validate PIN (demo)
    if (pin !== '1234') {
      return res.status(400).json({ error: 'Invalid PIN' });
    }
    
    // Simulate bill payment processing
    const payment = {
      id: `bill_${Date.now()}`,
      type: 'bill_payment',
      billType,
      provider,
      accountNumber,
      amount: parseInt(amount) * 100,
      currency: 'ngn',
      status: 'successful',
      reference: `BILL${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      payer: req.user?.email || 'unknown',
      created: Math.floor(Date.now() / 1000)
    };
    
    res.json({
      success: true,
      data: payment,
      message: `${billType} bill payment successful`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Bill payment failed'
    });
  }
};

export const getTransactionHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Mock transaction history
    const transactions = [
      {
        id: 'txn_001',
        type: 'transfer',
        amount: 1500000,
        currency: 'ngn',
        description: 'Transfer to john@example.com',
        status: 'completed',
        created: Math.floor(Date.now() / 1000) - 86400
      },
      {
        id: 'bill_002',
        type: 'bill_payment',
        amount: 850000,
        currency: 'ngn',
        description: 'AEDC Electricity Bill',
        status: 'successful',
        created: Math.floor(Date.now() / 1000) - 172800
      },
      {
        id: 'txn_003',
        type: 'airtime',
        amount: 200000,
        currency: 'ngn',
        description: 'MTN Airtime Purchase',
        status: 'completed',
        created: Math.floor(Date.now() / 1000) - 259200
      }
    ];
    
    res.json({
      success: true,
      data: transactions,
      meta: {
        total: transactions.length,
        user: req.user?.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction history'
    });
  }
};

export const getAccountBalance = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const balance = {
      available: 4500000, // ₦45,000 in kobo
      ledger: 4500000,
      currency: 'ngn',
      lastUpdated: Math.floor(Date.now() / 1000)
    };
    
    res.json({
      success: true,
      data: balance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch balance'
    });
  }
};