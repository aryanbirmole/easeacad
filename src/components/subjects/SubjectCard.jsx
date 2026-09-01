import { useNavigate } from 'react-router-dom';
import './SubjectCard.css';

function SubjectCard({ subject, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation(); // don't trigger navigation when clicking delete
    if (window.confirm(`Delete "${subject.name}"? This cannot be undone.`)) {
      onDelete(subject.id);
    }
  };

  return (
    <div
      className="subject-card"
      style={{ borderLeftColor: subject.color }}
      onClick={() => navigate(`/subjects/${subject.id}`)}
    >
      <span className="subject-card-name">{subject.name}</span>
      <button className="subject-card-delete" onClick={handleDelete}>✕</button>
    </div>
  );
}

export default SubjectCard;