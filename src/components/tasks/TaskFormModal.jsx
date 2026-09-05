import { useState } from 'react';
import { createTask, updateTask } from '../../api/tasks';
import '../notes/NoteModals.css';

function TaskFormModal({ subjectId, task, onClose, onSaved }) {
  const isEdit = Boolean(task);
  const [title, setTitle] = useState(task?.title || '');
  const [dueDate, setDueDate] = useState(task?.due_date ? task.due_date.slice(0, 10) : '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateTask(task.id, { title, due_date: dueDate || null });
        onSaved({ ...task, title, due_date: dueDate || null });
      } else {
        const newTask = await createTask({ subject_id: subjectId, title, due_date: dueDate || null });
        onSaved(newTask);
      }
      onClose();
    } catch (err) {
      setError('Could not save task. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? 'Edit Task' : 'New Task'}</h3>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}          
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">{isEdit ? 'Save Changes' : 'Add Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskFormModal;