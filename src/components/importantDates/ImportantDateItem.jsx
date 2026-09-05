import './ImportantDateItem.css';

function ImportantDateItem({ date, onToggle, onDelete, onEdit }) {
  const isOverdue = !date.is_done &&
    new Date(date.event_date) < new Date().setHours(0, 0, 0, 0);

  return (
    <div className={`date-item ${date.is_done ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={date.is_done}
        onChange={() => onToggle(date)}
      />
      <span className="date-title">{date.title}</span>
      <span className={`date-value ${isOverdue ? 'overdue' : ''}`}>
        {new Date(date.event_date).toLocaleDateString()}
      </span>
      <button className="date-edit" onClick={() => onEdit(date)}>✎</button>
      <button
        className="date-delete"
        onClick={() => {
          if (window.confirm("Delete this important date?")) {
            onDelete(date.id);
          }
        }}
      >
        ×
      </button>
    </div>
  );
}

export default ImportantDateItem;