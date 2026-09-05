import { useState, useEffect } from 'react';
import { updateNote, deleteNote } from '../../api/notes';
import { getAttachments, createAttachment, deleteAttachment } from '../../api/attachments';
import './NoteModals.css';

function NoteViewModal({ note, onClose, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || '');
  const [tags, setTags] = useState(note.tags || '');
  const [loading, setLoading] = useState(false);

  const [attachments, setAttachments] = useState([]);
  const [attachType, setAttachType] = useState('video_link');
  const [attachUrl, setAttachUrl] = useState('');
  const [attachTitle, setAttachTitle] = useState('');
  const [addingAttachment, setAddingAttachment] = useState(false);

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const data = await getAttachments(note.id);
        setAttachments(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAttachments();
  }, [note.id]);

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

  const handleAddAttachment = async (e) => {
    e.preventDefault();
    if (!attachUrl.trim()) return;
    setAddingAttachment(true);
    try {
      const newAttachment = await createAttachment({
        note_id: note.id,
        type: attachType,
        url: attachUrl.trim(),
        title: attachTitle.trim() || null,
      });
      setAttachments([newAttachment, ...attachments]);
      setAttachUrl('');
      setAttachTitle('');
    } catch (err) {
      console.error(err);
    } finally {
      setAddingAttachment(false);
    }
  };

  const handleDeleteAttachment = async (id) => {
    if (!window.confirm('Delete this attachment?')) return;
    await deleteAttachment(id);
    setAttachments(attachments.filter((a) => a.id !== id));
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

            <div className="note-attachments">
              <h3>Attachments</h3>

              {attachments.length === 0 ? (
                <p className="note-attachments-empty">No attachments yet.</p>
              ) : (
                <ul className="note-attachments-list">
                  {attachments.map((a) => (
                    <li key={a.id} className="note-attachment-item">
                      {a.type === 'image' ? (
                        <a href={a.url} target="_blank" rel="noopener noreferrer">
                          <img src={a.url} alt={a.title || 'attachment'} className="note-attachment-thumb" />
                        </a>
                      ) : (
                        <a href={a.url} target="_blank" rel="noopener noreferrer">
                          {a.title || a.url}
                        </a>
                      )}
                      <button
                        className="note-attachment-delete"
                        onClick={() => handleDeleteAttachment(a.id)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <form onSubmit={handleAddAttachment} className="note-attachment-form">
                <select value={attachType} onChange={(e) => setAttachType(e.target.value)}>
                  <option value="video_link">Video Link</option>
                  <option value="image">Image</option>
                  <option value="pdf">PDF</option>
                </select>
                <input
                  placeholder="Paste URL"
                  value={attachUrl}
                  onChange={(e) => setAttachUrl(e.target.value)}
                  required
                />
                <input
                  placeholder="Title (optional)"
                  value={attachTitle}
                  onChange={(e) => setAttachTitle(e.target.value)}
                />
                <button type="submit" disabled={addingAttachment}>
                  {addingAttachment ? 'Adding...' : 'Add'}
                </button>
              </form>
            </div>

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