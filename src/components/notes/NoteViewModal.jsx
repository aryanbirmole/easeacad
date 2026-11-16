import { useState, useEffect } from 'react';
import { updateNote, deleteNote } from '../../api/notes';
import { getAttachments, createAttachment, deleteAttachment } from '../../api/attachments';
import Icon from '../common/Icon';
import './NoteModals.css';

function NoteViewModal({ note, onClose, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || '');
  const [tags, setTags] = useState(note.tags || '');
  const [editTab, setEditTab] = useState('write');
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

  const parsedTags = note.tags
    ? note.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content note-modal" onClick={(e) => e.stopPropagation()}>
        {editing ? (
          <form onSubmit={handleSave}>
            <div className="modal-header">
              <h2>Edit Note</h2>
              <button type="button" className="modal-close-icon" onClick={() => setEditing(false)} aria-label="Cancel editing">✕</button>
            </div>

            <input
              className="note-input-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />

            <div className="note-editor-wrapper">
              <div className="note-tabs">
                <button
                  type="button"
                  className={`note-tab-btn ${editTab === 'write' ? 'active' : ''}`}
                  onClick={() => setEditTab('write')}
                >
                  Write
                </button>
                <button
                  type="button"
                  className={`note-tab-btn ${editTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setEditTab('preview')}
                >
                  Preview
                </button>
              </div>

              {editTab === 'write' ? (
                <textarea
                  className="note-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="Note content..."
                />
              ) : (
                <div className="note-preview-pane">
                  <h4 className="note-preview-title">{title || 'Untitled Note'}</h4>
                  <div className="note-preview-body">
                    {content ? content : <span className="note-preview-empty">No content...</span>}
                  </div>
                </div>
              )}
            </div>

            <input
              className="note-input-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
            />

            <div className="note-modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="note-view-header">
              <div className="note-view-title-group">
                <h2 className="note-view-title">{note.title}</h2>
              </div>
              <div className="note-view-controls">
                <button
                  className={`note-pin-btn ${note.pinned ? 'is-pinned' : ''}`}
                  onClick={handlePinToggle}
                  title={note.pinned ? 'Unpin note' : 'Pin note'}
                  aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
                >
                  <Icon name="pin" size={16} />
                </button>
                <button className="modal-close-icon" onClick={onClose} aria-label="Close modal">✕</button>
              </div>
            </div>

            {/* Content with exact line breaks & spacing preserved */}
            <div className="note-view-content">
              {note.content ? note.content : <span className="note-view-empty">No content entered for this note.</span>}
            </div>

            {parsedTags.length > 0 && (
              <div className="note-card-tags note-view-tags">
                {parsedTags.map((t) => (
                  <span key={t} className="note-card-tag">{t}</span>
                ))}
              </div>
            )}

            <div className="note-attachments">
              <div className="note-attachments-header">
                <h3>Attachments & References</h3>
                <span className="note-attachments-count">{attachments.length} items</span>
              </div>

              {attachments.length === 0 ? (
                <p className="note-attachments-empty">No external links or attachments yet.</p>
              ) : (
                <ul className="note-attachments-list">
                  {attachments.map((a) => (
                    <li key={a.id} className="note-attachment-item">
                      {a.type === 'image' ? (
                        <a href={a.url} target="_blank" rel="noopener noreferrer" className="note-attachment-link">
                          <img src={a.url} alt={a.title || 'attachment'} className="note-attachment-thumb" />
                          <span>{a.title || 'View Image'}</span>
                        </a>
                      ) : (
                        <a href={a.url} target="_blank" rel="noopener noreferrer" className="note-attachment-link">
                          <span className="attachment-badge">{a.type === 'video_link' ? 'Video' : 'Link'}</span>
                          <span>{a.title || a.url}</span>
                        </a>
                      )}
                      <button
                        className="note-attachment-delete"
                        onClick={() => handleDeleteAttachment(a.id)}
                        aria-label={`Delete attachment ${a.title || a.url}`}
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <form onSubmit={handleAddAttachment} className="note-attachment-form">
                <select value={attachType} onChange={(e) => setAttachType(e.target.value)}>
                  <option value="video_link">Video Link</option>
                  <option value="image">Image URL</option>
                  <option value="pdf">PDF Link</option>
                </select>
                <input
                  placeholder="Paste URL..."
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
                  {addingAttachment ? 'Adding...' : 'Attach'}
                </button>
              </form>
            </div>

            <div className="note-modal-actions note-view-actions">
              <button className="btn-secondary" onClick={() => setEditing(true)}>Edit Note</button>
              <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NoteViewModal;
