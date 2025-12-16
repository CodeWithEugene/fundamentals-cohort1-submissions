import { TaskService } from '../services/task.service';
import { TaskStatus, TaskPriority } from '../types';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
const TASK_CREATED = 'TASK_CREATED';
const TASK_UPDATED = 'TASK_UPDATED';
const TASK_DELETED = 'TASK_DELETED';

const taskService = TaskService.getInstance();

// Subscribe to task service updates
taskService.subscribe((task) => {
  pubsub.publish(TASK_UPDATED, { taskUpdated: task });
});

export const resolvers = {
  Query: {
    tasks: async () => {
      return await taskService.getAllTasks();
    },
    task: async (_: any, { id }: { id: string }) => {
      return await taskService.getTaskById(id);
    },
    tasksByStatus: async (_: any, { status }: { status: TaskStatus }) => {
      return await taskService.getTasksByStatus(status);
    },
    tasksByAssignee: async (_: any, { assigneeId }: { assigneeId: string }) => {
      return await taskService.getTasksByAssignee(assigneeId);
    },
  },

  Mutation: {
    createTask: async (_: any, { input }: { input: any }) => {
      const task = await taskService.createTask(input);
      pubsub.publish(TASK_CREATED, { taskCreated: task });
      return task;
    },
    updateTask: async (_: any, { input }: { input: any }) => {
      const task = await taskService.updateTask(input);
      if (task) {
        pubsub.publish(TASK_UPDATED, { taskUpdated: task });
      }
      return task;
    },
    deleteTask: async (_: any, { id }: { id: string }) => {
      const task = await taskService.getTaskById(id);
      const deleted = await taskService.deleteTask(id);
      if (deleted && task) {
        pubsub.publish(TASK_DELETED, { taskDeleted: task });
      }
      return deleted;
    },
  },

  Subscription: {
    taskCreated: {
      subscribe: () => pubsub.asyncIterator([TASK_CREATED]),
    },
    taskUpdated: {
      subscribe: () => pubsub.asyncIterator([TASK_UPDATED]),
    },
    taskDeleted: {
      subscribe: () => pubsub.asyncIterator([TASK_DELETED]),
    },
  },
};





