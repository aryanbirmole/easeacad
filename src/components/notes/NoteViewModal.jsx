import { useState } from 'react';
import { updateNote, deleteNote } from '../../api/notes';
import './NoteModals.css';

function NoteViewModal({ note, onClose, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || '');
  const [tags, setTags] = useState(note.tags || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateNote(note.id, { title, content, tags });
    onUpdated({ ...note, title, content, tags });
    setEditing(false);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this note?')) return;
    await deleteNote(note.id);
    onDeleted(note.id);
  };

  const handlePinToggle = async () => {
    const updated = { ...note, pinned: !note.pinned };
    await updateNote(note.id, { pinned: updated.pinned });
    onUpdated(updated);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content note-modal" onClick={(e) => e.stopPropagation()}>
        {editing ? (
          <form onSubmit={handleSave}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
            />
            <div className="note-modal-actions">
              <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="note-view-header">
              <h2>{note.title}</h2>
              <button onClick={handlePinToggle} title={note.pinned ? 'Unpin' : 'Pin'}>
                {note.pinned ? '📌' : '📍'}
              </button>
            </div>
            <p className="note-view-content">{note.content || 'No content'}</p>
            {note.tags && (
              <div className="note-card-tags">
                {note.tags.split(',').map((t) => (
                  <span key={t.trim()} className="note-tag">{t.trim()}</span>
                ))}
              </div>
            )}
            <div className="note-modal-actions">
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </>
        )}
        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default NoteViewModal;