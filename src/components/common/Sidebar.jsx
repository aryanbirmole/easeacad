import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, onClose }) {
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
      </aside>
    </>
  );
}

export default Sidebar;