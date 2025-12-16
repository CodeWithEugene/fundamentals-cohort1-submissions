import { TaskService } from '../src/services/task.service';
import { TaskStatus, TaskPriority } from '../src/types';

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = TaskService.getInstance();
    // Clear tasks before each test
    // Note: In a real implementation, you'd have a clear/reset method
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const input = {
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.HIGH,
      };

      const task = await taskService.createTask(input);

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.status).toBe(TaskStatus.TODO);
      expect(task.priority).toBe(TaskPriority.HIGH);
    });

    it('should set default priority to MEDIUM if not provided', async () => {
      const input = {
        title: 'Test Task',
      };

      const task = await taskService.createTask(input);

      expect(task.priority).toBe(TaskPriority.MEDIUM);
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      await taskService.createTask({ title: 'Task 1' });
      await taskService.createTask({ title: 'Task 2' });

      const tasks = await taskService.getAllTasks();

      expect(tasks.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getTaskById', () => {
    it('should return task by id', async () => {
      const created = await taskService.createTask({ title: 'Test Task' });
      const task = await taskService.getTaskById(created.id);

      expect(task).toBeDefined();
      expect(task?.id).toBe(created.id);
      expect(task?.title).toBe('Test Task');
    });

    it('should return null for non-existent task', async () => {
      const task = await taskService.getTaskById('non-existent-id');

      expect(task).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update task', async () => {
      const created = await taskService.createTask({ title: 'Original Title' });
      const updated = await taskService.updateTask({
        id: created.id,
        title: 'Updated Title',
        status: TaskStatus.IN_PROGRESS,
      });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should return null for non-existent task', async () => {
      const updated = await taskService.updateTask({
        id: 'non-existent-id',
        title: 'Updated Title',
      });

      expect(updated).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete task', async () => {
      const created = await taskService.createTask({ title: 'Task to Delete' });
      const deleted = await taskService.deleteTask(created.id);

      expect(deleted).toBe(true);

      const task = await taskService.getTaskById(created.id);
      expect(task).toBeNull();
    });

    it('should return false for non-existent task', async () => {
      const deleted = await taskService.deleteTask('non-existent-id');

      expect(deleted).toBe(false);
    });
  });

  describe('getTasksByStatus', () => {
    it('should return tasks by status', async () => {
      await taskService.createTask({ title: 'Todo Task' });
      const inProgress = await taskService.createTask({ title: 'In Progress Task' });
      await taskService.updateTask({
        id: inProgress.id,
        status: TaskStatus.IN_PROGRESS,
      });

      const todoTasks = await taskService.getTasksByStatus(TaskStatus.TODO);
      const inProgressTasks = await taskService.getTasksByStatus(TaskStatus.IN_PROGRESS);

      expect(todoTasks.length).toBeGreaterThan(0);
      expect(inProgressTasks.length).toBeGreaterThan(0);
      expect(inProgressTasks[0].status).toBe(TaskStatus.IN_PROGRESS);
    });
  });
});





