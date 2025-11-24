const express = require('express');
const { Validators, ValidationError } = require('../utils/validators');
const TokenUtils = require('../utils/tokenUtils');
const authenticateToken = require('../middleware/auth');
function createAuthRouter(userModel, redisClient, securityMiddleware) {
  const router = express.Router();

  // Register
  router.post('/register', async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      
      const validUsername = Validators.validateUsername(username);
      const validEmail = Validators.validateEmail(email);
      const validPassword = Validators.validatePassword(password);
      
      const existingUser = await userModel.findByEmail(validEmail);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      const userRole = role === 'admin' ? 'admin' : 'user';
      const userId = await userModel.create(validUsername, validEmail, validPassword, userRole);
      
      res.status(201).json({
        message: 'User registered successfully',
        user: { id: userId, username: validUsername, email: validEmail, role: userRole }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  // Login
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const validEmail = Validators.validateEmail(email);
      
      if (!password || typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      await securityMiddleware.checkAccountLock(validEmail);
      
      const user = await userModel.findByEmail(validEmail);
      if (!user) {
        await securityMiddleware.recordFailedLogin(validEmail);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const isValidPassword = await userModel.verifyPassword(password, user.password);
      
      if (!isValidPassword) {
        const remainingAttempts = await securityMiddleware.recordFailedLogin(validEmail);
        return res.status(401).json({ 
          error: 'Invalid credentials',
          remainingAttempts
        });
      }
      
      await securityMiddleware.resetFailedLogins(validEmail);
      await userModel.updateLastLogin(user.id);
      
      const accessToken = TokenUtils.generateAccessToken(user);
      const refreshToken = TokenUtils.generateRefreshToken(user);
      
      await redisClient.set(`refresh:${user.id}`, refreshToken);
      
      res.json({
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      if (error.message.includes('Account locked')) {
        return res.status(423).json({ error: error.message });
      }
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Refresh Token
  router.post('/refresh', async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
      }
      
      if (await TokenUtils.isTokenBlacklisted(redisClient, refreshToken)) {
        return res.status(403).json({ error: 'Token has been revoked' });
      }
      
      const decoded = TokenUtils.verifyRefreshToken(refreshToken);
      
      const storedToken = await redisClient.get(`refresh:${decoded.userId}`);
      if (storedToken !== refreshToken) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }
      
      const user = await userModel.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const newAccessToken = TokenUtils.generateAccessToken(user);
      
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
  });

  // Logout
  router.post('/logout', authenticateToken, async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (refreshToken) {
        await TokenUtils.blacklistToken(redisClient, refreshToken);
        await redisClient.del(`refresh:${req.user.userId}`);
      }
      
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  return router;
}

module.exports = createAuthRouter;
