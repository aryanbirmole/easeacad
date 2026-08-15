import { useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    subjects: 4,
    pendingTasks: 7,
    notes: 12,
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <br />
        <p>Welcome back! Here's your overview.</p>
      </header>

      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Subjects</h3>
          <p>{stats.subjects}</p>
        </div>

        <div className="summary-card">
          <h3>Pending Tasks</h3>
          <p>{stats.pendingTasks}</p>
        </div>

        <div className="summary-card">
          <h3>Notes</h3>
          <p>{stats.notes}</p>
        </div>
      </div>

      <div className="dashboard-upcoming">
        <h2>Upcoming Deadlines</h2>
        <ul>
          <li>DBMS Assignment — due in 2 days</li>
          <li>Web Dev Project Report — due in 5 days</li>
          <li>OS Unit Test — due in 7 days</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;