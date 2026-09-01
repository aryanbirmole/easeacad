import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';
import ChangeNameModal from './ChangeNameModal';
import './Navbar.css';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeName, setShowChangeName] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <span className="navbar-title">EaseAcad</span>
      <div className="navbar-profile-wrapper">
        <div className="navbar-profile" onClick={() => setShowDropdown(!showDropdown)}>
          <span className="navbar-avatar">👤</span>
          <span className="navbar-username">{user?.name}</span>
        </div>
        {showDropdown && (
          <div className="navbar-dropdown">
            <div onClick={() => { setShowChangeName(true); setShowDropdown(false); }}>
              Change Name
            </div>
            <div onClick={() => { setShowChangePassword(true); setShowDropdown(false); }}>
              Change Password
            </div>
            <div onClick={handleLogout}>Log out</div>
          </div>
        )}
      </div>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
      {showChangeName && (
        <ChangeNameModal onClose={() => setShowChangeName(false)} />
      )}
    </nav>
  );
}

export default Navbar;