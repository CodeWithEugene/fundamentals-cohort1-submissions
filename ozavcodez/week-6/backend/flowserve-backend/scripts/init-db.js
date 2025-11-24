const { sequelize } = require('../config/db');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const initDB = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDB();