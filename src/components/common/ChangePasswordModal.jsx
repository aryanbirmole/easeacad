import { useState } from 'react';
import { changePassword } from '../../api/auth';
import './ChangePasswordModal.css';

function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setMessage('Password updated! You can close this now.');
      setIsSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
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
        <h3>Change Password</h3>
        {message && (
          <p className={isSuccess ? 'auth-success' : 'auth-error'}>{message}</p>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
        <button onClick={onClose} className="modal-close">Close</button>
      </div>
    </div>
  );
}

export default ChangePasswordModal;