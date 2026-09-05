import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats, getUpcoming, getThisWeek } from '../../api/dashboard';
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
      `Welcome back ${user?.name || 'there'}! Here's your overview.`,
      "Let's see what's on your plate today.",
      "Ready to tackle your subjects?",
      "Here's where things stand.",
      `Hey ${user?.name || 'there'}, good to see you!`,
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

  if (loading) return <p>Loading...</p>;
  if (loadError) return <p className="load-error">Something went wrong loading your dashboard. Please refresh.</p>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <br />
        <p>{greeting}</p>
      </header>

      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>📚 Subjects</h3>
          <p>{stats.total_subjects}</p>
        </div>

        <div className="summary-card">
          <h3>📝 Pending Tasks</h3>
          <p>{stats.pending_tasks}</p>
        </div>

        <div className="summary-card">
          <h3>⚠️ Overdue Tasks</h3>
          <p>{stats.overdue_tasks}</p>
        </div>
      </div>

      <div className="dashboard-upcoming">
        <h2>Upcoming Deadlines</h2>
        {upcoming.length === 0 ? (
          <p>No upcoming deadlines in the next 7 days.</p>
        ) : (
          <ul>
            {upcoming.map((date) => (
              <li
                key={date.id}
                className={isOverdue(date.event_date) ? 'overdue' : ''}
                onClick={() => navigate(`/subjects/${date.subject_id}`)}
              >
                {date.subject_name} — {date.title} ({formatDateDistance(date.event_date)})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dashboard-this-week">
        <h2>This Week</h2>

        <h3>Tasks</h3>
        {thisWeek.tasks.length === 0 ? (
          <p>No tasks due this week.</p>
        ) : (
          <ul>
            {thisWeek.tasks.map((task) => (
              <li
                key={task.id}
                className={isOverdue(task.due_date) ? 'overdue' : ''}
                onClick={() => navigate(`/subjects/${task.subject_id}`)}
              >
                {task.subject_name} — {task.title} ({formatDueDate(task.due_date)})
              </li>
            ))}
          </ul>
        )}

        <h3>Important Dates</h3>
        {thisWeek.dates.length === 0 ? (
          <p>No important dates this week.</p>
        ) : (
          <ul>
            {thisWeek.dates.map((date) => (
              <li
                key={date.id}
                className={isOverdue(date.event_date) ? 'overdue' : ''}
                onClick={() => navigate(`/subjects/${date.subject_id}`)}
              >
                {date.subject_name} — {date.title} ({formatDateDistance(date.event_date)})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;