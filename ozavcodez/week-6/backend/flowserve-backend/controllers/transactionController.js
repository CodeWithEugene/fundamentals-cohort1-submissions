const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Joi = require('joi');
const { sequelize } = require('../config/db');

// Validation schema
const transactionSchema = Joi.object({
  userId: Joi.number().integer().required(),
  type: Joi.string().valid('credit', 'debit').required(),
  amount: Joi.number().positive().precision(2).required(),
  description: Joi.string().max(255).optional(),
  status: Joi.string().valid('pending', 'completed', 'failed').default('pending')
});

// Get all transactions with pagination
const getAllTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }]
    });

    res.json({
      transactions,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        totalTransactions: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get transaction by ID
const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id, {
      include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }]
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

// Create a new transaction
const createTransaction = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    // Validate request body
    const { error, value } = transactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if user exists
    const user = await User.findByPk(value.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // For debit transactions, check if user has sufficient balance
    if (value.type === 'debit') {
      if (user.walletBalance < value.amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      // Deduct amount from user's balance
      user.walletBalance = parseFloat(user.walletBalance) - parseFloat(value.amount);
    } else {
      // Add amount to user's balance for credit transactions
      user.walletBalance = parseFloat(user.walletBalance) + parseFloat(value.amount);
    }

    // Create transaction
    const transaction = await Transaction.create(value, { transaction });

    // Update user balance
    await user.save({ transaction });

    // Commit transaction
    await transaction.commit();

    res.status(201).json(transaction);
  } catch (error) {
    // Rollback transaction
    await transaction.rollback();
    next(error);
  }
};

// Update transaction
const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate request body
    const { error, value } = transactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await transaction.update(value);
    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

// Delete transaction
const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await transaction.destroy();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
};