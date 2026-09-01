import { useState } from 'react';
import './SubjectForm.css';

const COLOR_OPTIONS = ['#4f46e5', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7'];

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
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      <button type="submit" className="subject-form-submit" disabled={loading}>
        {loading ? 'Adding...' : '+ Add Subject'}
      </button>
    </form>
  );
}

export default SubjectForm;