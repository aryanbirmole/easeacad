import './NoteCard.css';

function NoteCard({ note, onClick }) {
  return (
    <div className="note-card" onClick={() => onClick(note)}>
      <div className="note-card-header">
        <h3>{note.title}</h3>
        {note.pinned && <span>📌</span>}
      </div>
      {note.content && <p className="note-card-preview">{note.content}</p>}
    </div>
  );
}

export default NoteCard;