import { useState } from 'react';
import Icon from '../common/Icon';
import './SubjectForm.css';

const COLOR_OPTIONS = ['#dc4c4c', '#e58a35', '#d2ad24', '#4d9b62', '#3985c6', '#8054b8', '#c34f91'];

function SubjectForm({ onAdd }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onAdd(name.trim(), color);
    setName('');
    setColor(COLOR_OPTIONS[0]);
    setLoading(false);
  };

  return (
    <form className="subject-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="New subject name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <div className="subject-form-colors">
        {COLOR_OPTIONS.map((c) => (
          <button
            type="button"
            key={c}
            className={`color-dot ${color === c ? 'selected' : ''}`}
            style={{ backgroundColor: c }}
            aria-label={`Use ${c} for this subject`}
            aria-pressed={color === c}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      <button
        type="submit"
        className="subject-form-submit"
        disabled={loading}
        style={{ backgroundColor: color }}
      >
        {loading ? 'Adding...' : <><Icon name="plus" size={16} /> Add Subject</>}
      </button>
    </form>
  );
}

export default SubjectForm;