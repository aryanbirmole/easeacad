import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import './Sidebar.css';

function Sidebar({ isOpen, onClose }) {
  const [isDark, setIsDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');

  const handleThemeToggle = () => {
    const theme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    setIsDark(theme === 'dark');
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-nav">
          <div className="sidebar-section-title">Academic Space</div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            onClick={onClose}
          >
            <Icon name="dashboard" size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/subjects"
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            onClick={onClose}
          >
            <Icon name="bookOpen" size={18} />
            <span>Courses</span>
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-date-pill" title="Today's Date">
            <Icon name="calendar" size={15} />
            <span className="sidebar-date-text">{todayFormatted}</span>
          </div>

          <button className="sidebar-theme-btn" type="button" onClick={handleThemeToggle}>
            <Icon name={isDark ? 'sun' : 'moon'} size={16} />
            <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
