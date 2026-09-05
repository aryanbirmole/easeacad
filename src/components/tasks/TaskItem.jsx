import './TaskItem.css';

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const isOverdue = task.due_date && task.status === 'pending' &&
    new Date(task.due_date) < new Date().setHours(0, 0, 0, 0);

  return (
    <div className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.status === 'completed'}
        onChange={() => onToggle(task)}
      />
      <span className="task-title">{task.title}</span>
      {task.due_date && (
        <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
          {new Date(task.due_date).toLocaleDateString()}
        </span>
      )}
      <button className="task-edit" onClick={() => onEdit(task)}>✎</button>
      <button
        className="task-delete"
        onClick={() => {
          if (window.confirm("Delete this task?")) {
            onDelete(task.id);
          }
        }}
      >
        ×
      </button>
      </div>
  );
}

export default TaskItem;