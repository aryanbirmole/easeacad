import Icon from '../common/Icon';
import './ImportantDateItem.css';

function ImportantDateItem({ date, onToggle, onDelete, onEdit }) {
  const isOverdue = !date.is_done &&
    new Date(date.event_date) < new Date().setHours(0, 0, 0, 0);

  return (
    <div className={`date-item ${date.is_done ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="date-checkbox"
        checked={date.is_done}
        aria-label={`${date.is_done ? 'Mark incomplete' : 'Mark complete'}: ${date.title}`}
        onChange={() => onToggle(date)}
      />
      <span className="date-title">{date.title}</span>
      <span className={`date-value ${isOverdue ? 'overdue' : ''}`}>
        {new Date(date.event_date).toLocaleDateString()}
      </span>
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