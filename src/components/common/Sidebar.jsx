import { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
          Dashboard
        </NavLink>
        <NavLink to="/subjects" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'} onClick={onClose}>
          Subjects
        </NavLink>
        <button className="sidebar-theme-btn" type="button" onClick={handleThemeToggle}>
          <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
          <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </aside>
    </>
  );
}

export default Sidebar;