import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';
import './SubjectCard.css';

function SubjectCard({ subject, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation(); // don't trigger navigation when clicking delete
    if (window.confirm(`Delete "${subject.name}"? This cannot be undone.`)) {
      onDelete(subject.id);
    }
  };

  const subjectColor = subject.color || 'var(--color-ui-accent-primary)';

  return (
    <div
      className="subject-card"
      style={{ '--subject-color': subjectColor }}
      onClick={() => navigate(`/subjects/${subject.id}`)}
      role="button"
      tabIndex={0}
    >
      <div className="subject-card-stripe" style={{ backgroundColor: subjectColor }} />
      <div
        className="subject-card-content"
        style={{
          background: `linear-gradient(180deg, ${subjectColor}0d 0%, transparent 50%)`
        }}
      >
        <div className="subject-card-header">
          <span
            className="subject-card-pill"
            style={{
              color: subjectColor,
              backgroundColor: `${subjectColor}16`,
              borderColor: `${subjectColor}38`,
            }}
          >
            Course
          </span>
          <button
            className="subject-card-delete"
            onClick={handleDelete}
            aria-label={`Delete ${subject.name}`}
            title="Delete course"
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
        <h3 className="subject-card-name">{subject.name}</h3>
        <div className="subject-card-footer">
          <span className="subject-card-view">View Course</span>
          <span className="subject-card-arrow">→</span>
        </div>
      </div>
    </div>
  );
}

export default SubjectCard;
