import { useState } from 'react';
import { createImportantDate, updateImportantDate } from '../../api/importantDates';
import '../notes/NoteModals.css';

function ImportantDateFormModal({ subjectId, date, onClose, onSaved }) {
  const isEdit = Boolean(date);
  const [title, setTitle] = useState(date?.title || '');
  const [eventDate, setEventDate] = useState(date?.event_date ? date.event_date.slice(0, 10) : '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateImportantDate(date.id, { title, event_date: eventDate });
        onSaved({ ...date, title, event_date: eventDate });
      } else {
        const newDate = await createImportantDate({ subject_id: subjectId, title, event_date: eventDate });
        onSaved(newDate);
      }
      onClose();
    } catch (err) {
      setError('Could not save date. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? 'Edit Important Date' : 'New Important Date'}</h3>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="e.g. Mid-Sem Exam"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">{isEdit ? 'Save Changes' : 'Add Date'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ImportantDateFormModal;