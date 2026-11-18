import Icon from '../common/Icon';
import './NoteCard.css';

const TAG_PALETTE = [
  { text: '#3985c6', bg: 'rgba(57, 133, 198, 0.12)', border: 'rgba(57, 133, 198, 0.28)' }, // Academic Blue
  { text: '#4d9b62', bg: 'rgba(77, 155, 98, 0.12)', border: 'rgba(77, 155, 98, 0.28)' },   // Sage Green
  { text: '#8054b8', bg: 'rgba(128, 84, 184, 0.12)', border: 'rgba(128, 84, 184, 0.28)' }, // Royal Purple
  { text: '#e58a35', bg: 'rgba(229, 138, 53, 0.12)', border: 'rgba(229, 138, 53, 0.28)' }, // Amber Orange
  { text: '#dc4c4c', bg: 'rgba(220, 76, 76, 0.12)', border: 'rgba(220, 76, 76, 0.28)' },   // Coral Red
  { text: '#c34f91', bg: 'rgba(195, 79, 145, 0.12)', border: 'rgba(195, 79, 145, 0.28)' }, // Berry Pink
  { text: '#b45309', bg: 'rgba(210, 173, 36, 0.14)', border: 'rgba(210, 173, 36, 0.32)' }, // Honey Gold
];

function getTagStyle(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash << 5) - hash + tag.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % TAG_PALETTE.length;
  return TAG_PALETTE[index];
}

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
          {tagsList.map((tag) => {
            const tagStyle = getTagStyle(tag);
            return (
              <span
                key={tag}
                className="note-card-tag"
                style={{
                  color: tagStyle.text,
                  backgroundColor: tagStyle.bg,
                  borderColor: tagStyle.border,
                }}
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NoteCard;
