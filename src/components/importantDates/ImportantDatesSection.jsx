import ImportantDateItem from './ImportantDateItem';
import './ImportantDatesSection.css';

function ImportantDatesSection({ dates, onToggle, onDelete, onEdit, onAddClick }) {
  return (
    <div className="dates-section">
      <div className="dates-header">
        <h2>Important Dates</h2>
        <button className="add-date-btn" onClick={onAddClick}>+ Add Date</button>
      </div>

      {dates.length === 0 ? (
        <p>No important dates yet.</p>
      ) : (
        dates.map(date => (
          <ImportantDateItem
            key={date.id}
            date={date}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))
      )}
    </div>
  );
}

export default ImportantDatesSection;