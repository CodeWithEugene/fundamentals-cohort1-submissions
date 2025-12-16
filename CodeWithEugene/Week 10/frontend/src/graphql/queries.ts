import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      status
      priority
      assigneeId
      assigneeName
      createdAt
      updatedAt
      dueDate
      tags
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      assigneeId
      assigneeName
      createdAt
      updatedAt
      dueDate
      tags
    }
  }
`;

export const GET_TASKS_BY_STATUS = gql`
  query GetTasksByStatus($status: TaskStatus!) {
    tasksByStatus(status: $status) {
      id
      title
      description
      status
      priority
      assigneeId
      assigneeName
      createdAt
      updatedAt
      dueDate
      tags
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
      assigneeId
      assigneeName
      createdAt
      updatedAt
      dueDate
      tags
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
      title
      description
      status
      priority
      assigneeId
      assigneeName
      createdAt
      updatedAt
      dueDate
      tags
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export const TASK_CREATED_SUBSCRIPTION = gql`
  subscription TaskCreated {
    taskCreated {
      id
      title
      description
      status
      priority
      assigneeId
      assigneeName
      createdAt
      updatedAt
      dueDate
      tags
    }
  }
`;

export const TASK_UPDATED_SUBSCRIPTION = gql`
  subscription TaskUpdated {
    taskUpdated {
      id
      title
      description
      status
      priority
      assigneeId
      assigneeName
      createdAt
      updatedAt
      dueDate
      tags
    }
  }
`;

export const TASK_DELETED_SUBSCRIPTION = gql`
  subscription TaskDeleted {
    taskDeleted {
      id
      title
      description
      status
      priority
      assigneeId
      assigneeName
      createdAt
      updatedAt
      dueDate
      tags
    }
  }
`;





