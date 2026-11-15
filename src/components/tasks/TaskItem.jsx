import Icon from '../common/Icon';
import './TaskItem.css';

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const isCompleted = task.status === 'completed';
  const isOverdue = task.due_date && task.status === 'pending' &&
    new Date(task.due_date) < new Date().setHours(0, 0, 0, 0);

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="task-item-checkbox"
        checked={isCompleted}
        aria-label={`${isCompleted ? 'Mark incomplete' : 'Complete'}: ${task.title}`}
        onChange={() => onToggle(task)}
      />
      <span className="task-title">{task.title}</span>
      {task.due_date && (
        <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
          {new Date(task.due_date).toLocaleDateString()}
        </span>
      )}
      <button className="task-edit" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} title="Edit task">
        <Icon name="pencil" size={16} />
      </button>
      <button
        className="task-delete"
        aria-label={`Delete ${task.title}`}
        title="Delete task"
        onClick={() => {
          if (window.confirm("Delete this task?")) {
            onDelete(task.id);
          }
        }}
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

export default TaskItem;