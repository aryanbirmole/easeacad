import { useState } from 'react';
import './NoteModals.css';

function NoteFormModal({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('write');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onAdd(title.trim(), content, tags);
    setLoading(false);
    onClose();
  };

  const parsedTags = tags
    ? tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content note-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Note</h2>
          <button className="modal-close-icon" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            className="note-input-title"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="note-editor-wrapper">
            <div className="note-tabs">
              <button
                type="button"
                className={`note-tab-btn ${activeTab === 'write' ? 'active' : ''}`}
                onClick={() => setActiveTab('write')}
              >
                Write
              </button>
              <button
                type="button"
                className={`note-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                Live Preview
              </button>
            </div>

            {activeTab === 'write' ? (
              <textarea
                className="note-textarea"
                placeholder="Write your note here... (line breaks and formatting are preserved)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
              />
            ) : (
              <div className="note-preview-pane">
                <h4 className="note-preview-title">{title || 'Untitled Note'}</h4>
                <div className="note-preview-body">
                  {content ? content : <span className="note-preview-empty">Type something in the Write tab to see preview...</span>}
                </div>
                {parsedTags.length > 0 && (
                  <div className="note-preview-tags">
                    {parsedTags.map((tag) => (
                      <span key={tag} className="note-card-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <input
            className="note-input-tags"
            placeholder="Tags (comma separated, e.g. lecture1, exam, formulas)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <div className="note-modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteFormModal;
