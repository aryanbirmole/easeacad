import { useState } from 'react';
import { createTask, updateTask } from '../../api/tasks';
import '../notes/NoteModals.css';

function TaskFormModal({ subjectId, task, onClose, onSaved }) {
  const isEdit = Boolean(task);
  const [title, setTitle] = useState(task?.title || '');
  const [dueDate, setDueDate] = useState(task?.due_date ? task.due_date.slice(0, 10) : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await updateTask(task.id, { title: title.trim(), due_date: dueDate || null });
        onSaved({ ...task, title: title.trim(), due_date: dueDate || null });
      } else {
        const newTask = await createTask({ subject_id: subjectId, title: title.trim(), due_date: dueDate || null });
        onSaved(newTask);
      }
      onClose();
    } catch (err) {
      setError('Could not save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button type="button" className="modal-close-icon" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label htmlFor="task-title">Task Title</label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Complete Lab Assignment 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="modal-field">
            <label htmlFor="task-due-date">Due Date <span className="field-optional">(Optional)</span></label>
            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskFormModal;
