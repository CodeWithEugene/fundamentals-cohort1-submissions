import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // allow sending/receiving httpOnly cookies (refresh token)
});

export const fetchPayments = async () => {
  const response = await api.get('/v2/payments');
  return response.data;
};

export const fetchCustomers = async () => {
  const response = await api.get('/v2/customers');
  return response.data;
};

export const fetchPaymentById = async (id) => {
  const response = await api.get(`/v2/payments/${id}`);
  return response.data;
};

export const fetchCustomerById = async (id) => {
  const response = await api.get(`/v2/customers/${id}`);
  return response.data;
};

// Auth endpoints (mock)
export const signup = async ({ email, password, name }) => {
  const response = await api.post('/auth/signup', { email, password, name });
  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const fetchMe = async (token) => {
  const response = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await api.post('/auth/refresh');
  return response.data;
};

export const logoutRequest = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const refundPayment = async (paymentId) => {
  const response = await api.post('/v2/refunds', {
    payment_intent: paymentId,
    amount: 5000,
    reason: 'requested_by_customer'
  });
  return response.data;
};

export const sendNotification = async (notificationData) => {
  const response = await api.post('/v2/notifications', notificationData);
  return response.data;
};

export const fetchRefunds = async () => {
  const response = await api.get('/v2/refunds');
  return response.data;
};

export const fetchNotifications = async () => {
  const response = await api.get('/v2/notifications');
  return response.data;
};

export const subscribe = async ({ email, name }) => {
  const response = await api.post('/v2/subscribe', { email, name });
  return response.data;
};

export const transferMoney = async (transferData) => {
  const response = await api.post('/v2/transfer', transferData);
  return response.data;
};

export const payBill = async (billData) => {
  const response = await api.post('/v2/bills', billData);
  return response.data;
};

export const getTransactionHistory = async () => {
  const response = await api.get('/v2/transactions');
  return response.data;
};

export const getAccountBalance = async () => {
  const response = await api.get('/v2/balance');
  return response.data;
};

// Admin APIs
export const getAllUsers = async () => {
  const response = await api.get('/v2/admin/users');
  return response.data;
};

export const updateUserStatus = async (userId, data) => {
  const response = await api.put(`/v2/admin/users/${userId}`, data);
  return response.data;
};

export const createUserAdmin = async (userData) => {
  const response = await api.post('/v2/admin/users', userData);
  return response.data;
};

export const deleteUserAdmin = async (userId) => {
  const response = await api.delete(`/v2/admin/users/${userId}`);
  return response.data;
};

export const getAllTransactionsAdmin = async () => {
  const response = await api.get('/v2/admin/transactions');
  return response.data;
};

export const reverseTransaction = async (transactionId, data) => {
  const response = await api.post(`/v2/admin/transactions/${transactionId}/reverse`, data);
  return response.data;
};

export const getSystemStats = async () => {
  const response = await api.get('/v2/admin/stats');
  return response.data;
};