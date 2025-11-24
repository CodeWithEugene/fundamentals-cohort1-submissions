// Mock data for testing purposes
export const mockUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    walletBalance: 5420.50
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    walletBalance: 3210.75
  },
  {
    id: 3,
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert@example.com',
    walletBalance: 12500.00
  }
];

export const mockTransactions = [
  {
    id: 1,
    userId: 1,
    type: 'Deposit',
    amount: 1500.00,
    status: 'completed'
  },
  {
    id: 2,
    userId: 2,
    type: 'Withdrawal',
    amount: 500.00,
    status: 'pending'
  },
  {
    id: 3,
    userId: 1,
    type: 'Transfer',
    amount: 250.00,
    status: 'completed'
  }
];