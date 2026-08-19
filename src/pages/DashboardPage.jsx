import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Dashboard from '../components/dashboard/Dashboard';

function DashboardPage() {
  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '24px' }}>
          <h1>EaseAcad</h1>
          <p>EaseAcad: A Centralized Solution to your Academic Stress!!</p>
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;