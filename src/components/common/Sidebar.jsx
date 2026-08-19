import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        Dashboard
      </NavLink>
      <NavLink to="/subjects" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        Subjects
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        Search
      </NavLink>
    </aside>
  );
}

export default Sidebar;