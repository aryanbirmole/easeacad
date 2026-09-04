import { useState } from 'react';
import './NoteModals.css';

function NoteFormModal({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onAdd(title.trim(), content, tags);
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content note-modal" onClick={(e) => e.stopPropagation()}>
        <h2>New Note</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />
          <input
            placeholder="Tags (comma separated, e.g. exam, unit1)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <div className="note-modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </form>
        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default NoteFormModal;