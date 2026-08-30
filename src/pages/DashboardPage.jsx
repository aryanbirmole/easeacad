import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Dashboard from '../components/dashboard/Dashboard';

function DashboardPage() {
  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '26px' }}>
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;