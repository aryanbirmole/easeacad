import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useState } from 'react';
import Dashboard from '../components/dashboard/Dashboard';
import '../styles/layout.css';

function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="page-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="page-content">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;