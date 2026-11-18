import Icon from '../common/Icon';
import './ImportantDateItem.css';

function getMilestoneInfo(dateString, isDone) {
  if (isDone) return { label: 'Done ✓', className: 'date-milestone-done' };
  if (!dateString) return null;
  const target = new Date(dateString);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: 'Overdue', className: 'date-milestone-overdue' };
  if (diffDays === 0) return { label: '📅 Today', className: 'date-milestone-today' };
  if (diffDays === 1) return { label: '📅 Tomorrow', className: 'date-milestone-soon' };
  if (diffDays <= 7) return { label: `📅 In ${diffDays} days`, className: 'date-milestone-week' };
  return { label: target.toLocaleDateString(), className: 'date-milestone-normal' };
}

function ImportantDateItem({ date, onToggle, onDelete, onEdit }) {
  const milestoneInfo = getMilestoneInfo(date.event_date, date.is_done);

  return (
    <div className={`date-item ${date.is_done ? 'completed' : ''} ${milestoneInfo?.className ? `item-${milestoneInfo.className}` : ''}`}>
      <input
        type="checkbox"
        className="date-checkbox"
        checked={date.is_done}
        aria-label={`${date.is_done ? 'Mark incomplete' : 'Mark complete'}: ${date.title}`}
        onChange={() => onToggle(date)}
      />
      <span className="date-title">{date.title}</span>
      {milestoneInfo && (
        <span className={`date-value ${milestoneInfo.className}`}>
          {milestoneInfo.label}
        </span>
      )}
      <button className="date-edit" onClick={() => onEdit(date)} aria-label={`Edit ${date.title}`} title="Edit date">
        <Icon name="pencil" size={16} />
      </button>
      <button
        className="date-delete"
        aria-label={`Delete ${date.title}`}
        title="Delete date"
        onClick={() => {
          if (window.confirm("Delete this important date?")) {
            onDelete(date.id);
          }
        }}
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

export default ImportantDateItem;
