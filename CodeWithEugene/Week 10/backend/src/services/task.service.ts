import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority } from '../types';

// In-memory store (in production, this would be a database)
const tasks: Task[] = [];

export class TaskService {
  private static instance: TaskService;
  private subscribers: Set<(task: Task) => void> = new Set();

  private constructor() {}

  static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  subscribe(callback: (task: Task) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(task: Task): void {
    this.subscribers.forEach((callback) => {
      try {
        callback(task);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  async getAllTasks(): Promise<Task[]> {
    return [...tasks];
  }

  async getTaskById(id: string): Promise<Task | null> {
    return tasks.find((task) => task.id === id) || null;
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    return tasks.filter((task) => task.status === status);
  }

  async getTasksByAssignee(assigneeId: string): Promise<Task[]> {
    return tasks.filter((task) => task.assigneeId === assigneeId);
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      id: uuidv4(),
      title: input.title,
      description: input.description,
      status: TaskStatus.TODO,
      priority: input.priority || TaskPriority.MEDIUM,
      assigneeId: input.assigneeId,
      assigneeName: input.assigneeName,
      createdAt: now,
      updatedAt: now,
      dueDate: input.dueDate,
      tags: input.tags || [],
    };

    tasks.push(task);
    this.notifySubscribers(task);
    return task;
  }

  async updateTask(input: UpdateTaskInput): Promise<Task | null> {
    const taskIndex = tasks.findIndex((task) => task.id === input.id);
    if (taskIndex === -1) {
      return null;
    }

    const existingTask = tasks[taskIndex];
    const updatedTask: Task = {
      ...existingTask,
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.priority !== undefined && { priority: input.priority }),
      ...(input.assigneeId !== undefined && { assigneeId: input.assigneeId }),
      ...(input.assigneeName !== undefined && { assigneeName: input.assigneeName }),
      ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
      ...(input.tags !== undefined && { tags: input.tags }),
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;
    this.notifySubscribers(updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      return false;
    }

    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);
    this.notifySubscribers(deletedTask);
    return true;
  }
}





