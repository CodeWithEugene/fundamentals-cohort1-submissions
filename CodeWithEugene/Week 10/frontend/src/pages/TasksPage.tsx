import { useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import {
  GET_TASKS,
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  TASK_CREATED_SUBSCRIPTION,
  TASK_UPDATED_SUBSCRIPTION,
  TASK_DELETED_SUBSCRIPTION,
} from '../graphql/queries';
import { Task, TaskStatus, TaskPriority, CreateTaskInput, UpdateTaskInput } from '../types';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import './TasksPage.css';

function TasksPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL'>('ALL');

  const { data, loading, error, refetch } = useQuery<{ tasks: Task[] }>(GET_TASKS);

  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  // Real-time subscriptions
  useSubscription(TASK_CREATED_SUBSCRIPTION, {
    onData: () => {
      refetch();
    },
  });

  useSubscription(TASK_UPDATED_SUBSCRIPTION, {
    onData: () => {
      refetch();
    },
  });

  useSubscription(TASK_DELETED_SUBSCRIPTION, {
    onData: () => {
      refetch();
    },
  });

  const handleCreateTask = async (input: CreateTaskInput) => {
    try {
      await createTask({ variables: { input } });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (input: UpdateTaskInput) => {
    try {
      await updateTask({ variables: { input } });
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask({ variables: { id } });
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const filteredTasks = data?.tasks.filter((task) => {
    if (filterStatus === 'ALL') return true;
    return task.status === filterStatus;
  }) || [];

  if (loading) {
    return (
      <div className="tasks-page">
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-page">
        <div className="error">Error loading tasks: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h2>Tasks</h2>
        <div className="tasks-actions">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'ALL')}
            className="filter-select"
          >
            <option value="ALL">All Tasks</option>
            <option value={TaskStatus.TODO}>Todo</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
            <option value={TaskStatus.ARCHIVED}>Archived</option>
          </select>
          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(!showForm);
            }}
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>
      </div>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      <div className="tasks-grid">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">No tasks found. Create your first task!</div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
            />
          ))
        )}
      </div>

      <div className="realtime-indicator">
        <span className="indicator-dot"></span>
        <span>Real-time updates enabled</span>
      </div>
    </div>
  );
}

export default TasksPage;





