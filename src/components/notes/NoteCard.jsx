import Icon from '../common/Icon';
import './NoteCard.css';

function NoteCard({ note, onClick }) {
  const tagsList = note.tags
    ? note.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="note-card" onClick={() => onClick(note)} role="button" tabIndex={0}>
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title}</h3>
        {note.pinned && (
          <span className="note-pin-badge" title="Pinned note">
            <Icon name="pin" size={14} />
          </span>
        )}
      </div>

      {note.content && (
        <p className="note-card-preview">{note.content}</p>
      )}

      {tagsList.length > 0 && (
        <div className="note-card-tags">
          {tagsList.map((tag) => (
            <span key={tag} className="note-card-tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoteCard;
