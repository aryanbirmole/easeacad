import Icon from '../common/Icon';
import './NoteCard.css';

function NoteCard({ note, onClick }) {
  return (
    <div className="note-card" onClick={() => onClick(note)}>
      <div className="note-card-header">
        <h3>{note.title}</h3>
        {note.pinned && <Icon className="note-pin-icon" name="pin" size={16} />}
      </div>
      {note.content && <p className="note-card-preview">{note.content}</p>}
    </div>
  );
}

export default NoteCard;