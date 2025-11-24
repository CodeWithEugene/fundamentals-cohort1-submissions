const express = require('express');
const { Validators, ValidationError } = require('../utils/validators');
const authenticateToken = require('../middleware/auth');
const requireRole = require('../middleware/rbac');

function createTaskRouter(taskModel) {
  const router = express.Router();

  // Get all tasks
  router.get('/', authenticateToken, requireRole('user', 'admin'), async (req, res) => {
    try {
      let tasks;
      if (req.user.role === 'admin') {
        tasks = await taskModel.findAll();
      } else {
        tasks = await taskModel.findByUserId(req.user.userId);
      }
      
      res.json({ tasks, count: tasks.length });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
  });

  // Create task
  router.post('/', authenticateToken, requireRole('user', 'admin'), async (req, res) => {
    try {
      const { title, description, status } = req.body;
      
      const { title: validTitle, description: validDescription } = Validators.validateTaskInput(title, description);
      
      const validStatuses = ['pending', 'in-progress', 'completed'];
      const taskStatus = validStatuses.includes(status) ? status : 'pending';
      
      const taskId = await taskModel.create(req.user.userId, validTitle, validDescription, taskStatus);
      
      const newTask = await taskModel.findById(taskId);
      
      res.status(201).json({
        message: 'Task created successfully',
        task: newTask
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  // Delete task (Admin only)
  router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
      const taskId = parseInt(req.params.id, 10);
      
      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
      }
      
      const task = await taskModel.findById(taskId);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      await taskModel.delete(taskId);
      
      res.json({
        message: 'Task deleted successfully',
        taskId
      });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  // Search tasks
  router.post('/search', authenticateToken, requireRole('user', 'admin'), async (req, res) => {
    try {
      const { query, page = 1, limit = 10 } = req.body;
      
      const { page: validPage, limit: validLimit } = Validators.validatePagination(page, limit);
      const searchQuery = Validators.validateSearchQuery(query);
      
      const isAdmin = req.user.role === 'admin';
      const result = await taskModel.search(req.user.userId, searchQuery, isAdmin, validPage, validLimit);
      
      res.json({
        tasks: result.tasks,
        pagination: {
          page: validPage,
          limit: validLimit,
          total: result.total,
          totalPages: Math.ceil(result.total / validLimit)
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Search tasks error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  });

  // Filter tasks
  router.post('/filter', authenticateToken, requireRole('user', 'admin'), async (req, res) => {
    try {
      const { status, dateFrom, dateTo, page = 1, limit = 10 } = req.body;
      
      const { page: validPage, limit: validLimit } = Validators.validatePagination(page, limit);
      
      const isAdmin = req.user.role === 'admin';
      const result = await taskModel.filter(
        req.user.userId, 
        status, 
        dateFrom, 
        dateTo, 
        isAdmin, 
        validPage, 
        validLimit
      );
      
      res.json({
        tasks: result.tasks,
        pagination: {
          page: validPage,
          limit: validLimit,
          total: result.total,
          totalPages: Math.ceil(result.total / validLimit)
        },
        filters: { status, dateFrom, dateTo }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Filter tasks error:', error);
      res.status(500).json({ error: 'Filter failed' });
    }
  });

  return router;
}
module.exports = createTaskRouter;
