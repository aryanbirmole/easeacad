import Icon from '../common/Icon';
import './TaskItem.css';

function getDueInfo(dueDateString, isCompleted) {
  if (isCompleted) return { label: 'Done ✓', className: 'task-due-done' };
  if (!dueDateString) return null;
  const target = new Date(dueDateString);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: 'Overdue', className: 'task-due-overdue' };
  if (diffDays === 0) return { label: 'Due Today', className: 'task-due-today' };
  if (diffDays === 1) return { label: 'Tomorrow', className: 'task-due-soon' };
  return { label: target.toLocaleDateString(), className: 'task-due-normal' };
}

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const isCompleted = task.status === 'completed';
  const dueInfo = getDueInfo(task.due_date, isCompleted);

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''} ${dueInfo?.className ? `item-${dueInfo.className}` : ''}`}>
      <input
        type="checkbox"
        className="task-item-checkbox"
        checked={isCompleted}
        aria-label={`${isCompleted ? 'Mark incomplete' : 'Complete'}: ${task.title}`}
        onChange={() => onToggle(task)}
      />
      <span className="task-title">{task.title}</span>
      {dueInfo && (
        <span className={`task-due ${dueInfo.className}`}>
          {dueInfo.label}
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
