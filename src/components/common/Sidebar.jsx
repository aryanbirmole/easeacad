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

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'} onClick={onClose}>
          <Icon name="dashboard" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/subjects" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'} onClick={onClose}>
          <Icon name="bookOpen" />
          <span>Subjects</span>
        </NavLink>
        <button className="sidebar-theme-btn" type="button" onClick={handleThemeToggle}>
          <Icon name={isDark ? 'sun' : 'moon'} size={18} />
          <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </aside>
    </>
  );
}

export default Sidebar;