import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats, getUpcoming, getThisWeek } from '../../api/dashboard';
import Icon from '../common/Icon';
import './Dashboard.css';

function isOverdue(dateString) {
  const target = new Date(dateString);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return target < today;
}

function formatDueDate(dateString) {
  const due = new Date(dateString);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Due today';
  if (diffDays > 0) return `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
  const overdueDays = Math.abs(diffDays);
  return `Overdue by ${overdueDays} day${overdueDays === 1 ? '' : 's'}`;
}

function formatDateDistance(dateString) {
  const target = new Date(dateString);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays > 0) return `In ${diffDays} day${diffDays === 1 ? '' : 's'}`;
  const pastDays = Math.abs(diffDays);
  return `${pastDays} day${pastDays === 1 ? '' : 's'} ago`;
}

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ total_subjects: 0, pending_tasks: 0, overdue_tasks: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [thisWeek, setThisWeek] = useState({ tasks: [], dates: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [greeting] = useState(() => {
    const messages = [
      `Welcome back, ${user?.name || 'there'}! Here is your study overview.`,
      "Here is what's on your agenda today.",
      "Ready to dive into your courses?",
      "Here is your week at a glance.",
      `Hey ${user?.name || 'there'}, hope studying goes smoothly today!`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, upcomingData, thisWeekData] = await Promise.all([
          getDashboardStats(),
          getUpcoming(),
          getThisWeek(),
        ]);
        setStats(statsData);
        setUpcoming(upcomingData);
        setThisWeek(thisWeekData);
        setLoadError(false);
      } catch (err) {
        console.error(err);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>
        <p>Loading overview...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <p className="load-error">Something went wrong loading your dashboard. Please refresh.</p>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">{greeting}</p>
      </header>

      {/* Professional Summary Stat Cards */}
      <div className="dashboard-summary">
        <div className="summary-card" onClick={() => navigate('/subjects')} role="button" tabIndex={0}>
          <div className="summary-card-header">
            <span className="summary-card-label">Courses</span>
            <div className="summary-card-icon icon-courses">
              <Icon name="bookOpen" size={17} />
            </div>
          </div>
          <p className="summary-card-count">{stats.total_subjects}</p>
          <span className="summary-card-status">Active courses</span>
        </div>

        <div className="summary-card" role="region" aria-label="Pending Tasks">
          <div className="summary-card-header">
            <span className="summary-card-label">Pending Tasks</span>
            <div className="summary-card-icon icon-tasks">
              <Icon name="listChecks" size={17} />
            </div>
          </div>
          <p className="summary-card-count">{stats.pending_tasks}</p>
          <span className="summary-card-status">Tasks to complete</span>
        </div>

        <div className={`summary-card ${stats.overdue_tasks > 0 ? 'card-warning' : ''}`} role="region" aria-label="Overdue Tasks">
          <div className="summary-card-header">
            <span className="summary-card-label">Overdue</span>
            <div className="summary-card-icon icon-overdue">
              <Icon name="alertTriangle" size={17} />
            </div>
          </div>
          <p className="summary-card-count">{stats.overdue_tasks}</p>
          <span className="summary-card-status">
            {stats.overdue_tasks > 0 ? 'Requires attention' : 'All caught up'}
          </span>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="dashboard-upcoming">
        <div className="dashboard-section-header">
          <h2>Upcoming Deadlines</h2>
          <span className="section-badge">Next 7 days</span>
        </div>

        {upcoming.length === 0 ? (
          <div className="dashboard-empty-state">
            <p>No upcoming deadlines in the next 7 days.</p>
          </div>
        ) : (
          <ul className="dashboard-list">
            {upcoming.map((date) => (
              <li
                key={date.id}
                className={`dashboard-list-item ${isOverdue(date.event_date) ? 'overdue' : ''}`}
                onClick={() => navigate(`/subjects/${date.subject_id}`)}
              >
                <div className="item-main">
                  <span className="item-subject">{date.subject_name}</span>
                  <span className="item-divider">—</span>
                  <span className="item-title">{date.title}</span>
                </div>
                <span className="item-tag">{formatDateDistance(date.event_date)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* This Week */}
      <div className="dashboard-this-week">
        <div className="dashboard-section-header">
          <h2>This Week</h2>
        </div>

        <h3 className="dashboard-subheading">Assignments & Tasks</h3>
        {thisWeek.tasks.length === 0 ? (
          <div className="dashboard-empty-state">
            <p>No tasks due this week.</p>
          </div>
        ) : (
          <ul className="dashboard-list dashboard-task-list">
            {thisWeek.tasks.map((task) => (
              <li
                key={task.id}
                className={`dashboard-list-item ${isOverdue(task.due_date) ? 'overdue' : ''}`}
                onClick={() => navigate(`/subjects/${task.subject_id}`)}
              >
                <div className="item-main">
                  <span className="item-subject">{task.subject_name}</span>
                  <span className="item-divider">—</span>
                  <span className="item-title">{task.title}</span>
                </div>
                <span className="item-tag">{formatDueDate(task.due_date)}</span>
              </li>
            ))}
          </ul>
        )}

        <h3 className="dashboard-subheading">Important Dates</h3>
        {thisWeek.dates.length === 0 ? (
          <div className="dashboard-empty-state">
            <p>No important dates this week.</p>
          </div>
        ) : (
          <ul className="dashboard-list">
            {thisWeek.dates.map((date) => (
              <li
                key={date.id}
                className={`dashboard-list-item ${isOverdue(date.event_date) ? 'overdue' : ''}`}
                onClick={() => navigate(`/subjects/${date.subject_id}`)}
              >
                <div className="item-main">
                  <span className="item-subject">{date.subject_name}</span>
                  <span className="item-divider">—</span>
                  <span className="item-title">{date.title}</span>
                </div>
                <span className="item-tag">{formatDateDistance(date.event_date)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
