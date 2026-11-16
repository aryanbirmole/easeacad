import { useState } from 'react';
import { createImportantDate, updateImportantDate } from '../../api/importantDates';
import '../notes/NoteModals.css';

function ImportantDateFormModal({ subjectId, date, onClose, onSaved }) {
  const isEdit = Boolean(date);
  const [title, setTitle] = useState(date?.title || '');
  const [eventDate, setEventDate] = useState(date?.event_date ? date.event_date.slice(0, 10) : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await updateImportantDate(date.id, { title: title.trim(), event_date: eventDate });
        onSaved({ ...date, title: title.trim(), event_date: eventDate });
      } else {
        const newDate = await createImportantDate({ subject_id: subjectId, title: title.trim(), event_date: eventDate });
        onSaved(newDate);
      }
      onClose();
    } catch (err) {
      setError('Could not save date. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Important Date' : 'New Important Date'}</h2>
          <button type="button" className="modal-close-icon" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label htmlFor="date-title">Event / Milestone Title</label>
            <input
              id="date-title"
              type="text"
              placeholder="e.g. Mid-Semester Exam or Project Viva"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="modal-field">
            <label htmlFor="date-event">Target Date</label>
            <input
              id="date-event"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Date'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ImportantDateFormModal;
