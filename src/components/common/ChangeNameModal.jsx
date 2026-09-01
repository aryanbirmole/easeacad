import { useState } from 'react';
import { updateName } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import './ChangePasswordModal.css';

function ChangeNameModal({ onClose }) {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await updateName(name);
      updateUser({ name: res.name });
      setMessage('Name updated!');
      setIsSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Change Name</h3>
        {message && (
          <p className={isSuccess ? 'auth-success' : 'auth-error'}>{message}</p>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Name'}
          </button>
        </form>
        <button onClick={onClose} className="modal-close">Close</button>
      </div>
    </div>
  );
}

export default ChangeNameModal;