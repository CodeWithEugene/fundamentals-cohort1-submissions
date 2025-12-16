import { Task, TaskStatus, TaskPriority, UpdateTaskInput } from '../types';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdate: (input: UpdateTaskInput) => void;
}

function TaskCard({ task, onEdit, onDelete, onUpdate }: TaskCardProps) {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return '#ff9800';
      case TaskStatus.IN_PROGRESS:
        return '#2196f3';
      case TaskStatus.COMPLETED:
        return '#4caf50';
      case TaskStatus.ARCHIVED:
        return '#9e9e9e';
      default:
        return '#999';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return '#4caf50';
      case TaskPriority.MEDIUM:
        return '#ff9800';
      case TaskPriority.HIGH:
        return '#f44336';
      default:
        return '#999';
    }
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    onUpdate({
      id: task.id,
      status: newStatus,
    });
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <button
            onClick={() => onEdit(task)}
            className="btn-icon"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="btn-icon"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <div className="task-badges">
          <span
            className="badge badge-status"
            style={{ backgroundColor: getStatusColor(task.status) }}
          >
            {task.status.replace('_', ' ')}
          </span>
          <span
            className="badge badge-priority"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {task.priority}
          </span>
        </div>

        {task.assigneeName && (
          <div className="task-assignee">
            👤 {task.assigneeName}
          </div>
        )}

        {task.dueDate && (
          <div className="task-due-date">
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="task-tags">
            {task.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="task-status-actions">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          className="status-select"
          style={{ borderColor: getStatusColor(task.status) }}
        >
          <option value={TaskStatus.TODO}>Todo</option>
          <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
          <option value={TaskStatus.COMPLETED}>Completed</option>
          <option value={TaskStatus.ARCHIVED}>Archived</option>
        </select>
      </div>

      <div className="task-timestamps">
        <small>Created: {new Date(task.createdAt).toLocaleString()}</small>
        {task.updatedAt !== task.createdAt && (
          <small>Updated: {new Date(task.updatedAt).toLocaleString()}</small>
        )}
      </div>
    </div>
  );
}

export default TaskCard;





