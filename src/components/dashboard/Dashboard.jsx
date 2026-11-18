import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats, getUpcoming, getThisWeek } from '../../api/dashboard';
import { getSubjects } from '../../api/subjects';
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

  if (diffDays === 0) return '⏳ Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays > 1) return `Due in ${diffDays} days`;
  const overdueDays = Math.abs(diffDays);
  return `Overdue by ${overdueDays} day${overdueDays === 1 ? '' : 's'}`;
}

function formatDateDistance(dateString) {
  const target = new Date(dateString);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '📅 Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1) return `In ${diffDays} days`;
  const pastDays = Math.abs(diffDays);
  return `${pastDays} day${pastDays === 1 ? '' : 's'} ago`;
}

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ total_subjects: 0, pending_tasks: 0, overdue_tasks: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [thisWeek, setThisWeek] = useState({ tasks: [], dates: [] });
  const [subjectColors, setSubjectColors] = useState({});
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
        const [statsData, upcomingData, thisWeekData, subjectsData] = await Promise.all([
          getDashboardStats(),
          getUpcoming(),
          getThisWeek(),
          getSubjects().catch(() => []),
        ]);
        setStats(statsData);
        setUpcoming(upcomingData);
        setThisWeek(thisWeekData);

        const colorMap = {};
        if (Array.isArray(subjectsData)) {
          subjectsData.forEach((s) => {
            colorMap[s.id] = s.color;
          });
        }
        setSubjectColors(colorMap);
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

  const getSubjectColor = (id, fallback) => subjectColors[id] || fallback || '#3985c6';

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

      {/* Dynamic Collegiate Summary Stat Cards */}
      <div className="dashboard-summary">
        {/* COURSES CARD */}
        <div
          className="summary-card card-courses"
          onClick={() => navigate('/subjects')}
          role="button"
          tabIndex={0}
        >
          <div className="summary-card-header">
            <span className="summary-card-label">Active Courses</span>
            <div className="summary-card-icon icon-courses">
              <Icon name="bookOpen" size={17} />
            </div>
          </div>
          <p className="summary-card-count count-courses">{stats.total_subjects}</p>
          <span className="summary-card-status">Enrolled courses</span>
          <div className="summary-card-action">
            <span>Manage courses</span>
            <span className="action-arrow">→</span>
          </div>
        </div>

        {/* TASKS CARD */}
        <div className="summary-card card-tasks" role="region" aria-label="Pending Tasks">
          <div className="summary-card-header">
            <span className="summary-card-label">Pending Tasks</span>
            <div className="summary-card-icon icon-tasks">
              <Icon name="listChecks" size={17} />
            </div>
          </div>
          <p className="summary-card-count count-tasks">{stats.pending_tasks}</p>
          <span className="summary-card-status">Assignments to complete</span>
          <div className="summary-card-action">
            <span>View assignments</span>
            <span className="action-arrow">→</span>
          </div>
        </div>

        {/* OVERDUE CARD */}
        <div
          className={`summary-card card-overdue ${stats.overdue_tasks > 0 ? 'card-warning' : 'card-success'}`}
          role="region"
          aria-label="Overdue Tasks"
        >
          <div className="summary-card-header">
            <span className="summary-card-label">Overdue Alert</span>
            <div className="summary-card-icon icon-overdue">
              <Icon name={stats.overdue_tasks > 0 ? 'alertTriangle' : 'check'} size={17} />
            </div>
          </div>
          <p className="summary-card-count count-overdue">{stats.overdue_tasks}</p>
          <span className="summary-card-status">
            {stats.overdue_tasks > 0 ? 'Requires attention' : 'All caught up! 🎉'}
          </span>
          <div className="summary-card-action">
            <span>{stats.overdue_tasks > 0 ? 'Resolve backlog' : 'Great pace'}</span>
            <span className="action-arrow">→</span>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="dashboard-upcoming">
        <div className="dashboard-section-header">
          <div>
            <h2>Upcoming Deadlines</h2>
            <p className="section-description">Milestones and deadlines approaching in the next 7 days</p>
          </div>
          <span className="section-badge">Next 7 days</span>
        </div>

        {upcoming.length === 0 ? (
          <div className="dashboard-empty-state">
            <p>No upcoming deadlines in the next 7 days.</p>
          </div>
        ) : (
          <ul className="dashboard-list">
            {upcoming.map((date) => {
              const color = getSubjectColor(date.subject_id, date.subject_color);
              const overdue = isOverdue(date.event_date);
              return (
                <li
                  key={date.id}
                  className={`dashboard-list-item ${overdue ? 'overdue' : ''}`}
                  style={{ borderLeftColor: color }}
                  onClick={() => navigate(`/subjects/${date.subject_id}`)}
                >
                  <div className="item-main">
                    <span
                      className="item-subject-pill"
                      style={{
                        color: color,
                        backgroundColor: `${color}14`,
                        borderColor: `${color}35`,
                      }}
                    >
                      {date.subject_name}
                    </span>
                    <span className="item-title">{date.title}</span>
                  </div>
                  <span className={`item-tag ${overdue ? 'tag-overdue' : 'tag-upcoming'}`}>
                    {formatDateDistance(date.event_date)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* This Week */}
      <div className="dashboard-this-week">
        <div className="dashboard-section-header">
          <div>
            <h2>This Week</h2>
            <p className="section-description">Your weekly schedule of tasks and important dates</p>
          </div>
        </div>

        <h3 className="dashboard-subheading">Assignments & Tasks</h3>
        {thisWeek.tasks.length === 0 ? (
          <div className="dashboard-empty-state">
            <p>No tasks due this week.</p>
          </div>
        ) : (
          <ul className="dashboard-list dashboard-task-list">
            {thisWeek.tasks.map((task) => {
              const color = getSubjectColor(task.subject_id, task.subject_color);
              const overdue = isOverdue(task.due_date);
              return (
                <li
                  key={task.id}
                  className={`dashboard-list-item ${overdue ? 'overdue' : ''}`}
                  style={{ borderLeftColor: color }}
                  onClick={() => navigate(`/subjects/${task.subject_id}`)}
                >
                  <div className="item-main">
                    <span
                      className="item-subject-pill"
                      style={{
                        color: color,
                        backgroundColor: `${color}14`,
                        borderColor: `${color}35`,
                      }}
                    >
                      {task.subject_name}
                    </span>
                    <span className="item-title">{task.title}</span>
                  </div>
                  <span className={`item-tag ${overdue ? 'tag-overdue' : 'tag-due'}`}>
                    {formatDueDate(task.due_date)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <h3 className="dashboard-subheading">Important Dates</h3>
        {thisWeek.dates.length === 0 ? (
          <div className="dashboard-empty-state">
            <p>No important dates this week.</p>
          </div>
        ) : (
          <ul className="dashboard-list">
            {thisWeek.dates.map((date) => {
              const color = getSubjectColor(date.subject_id, date.subject_color);
              const overdue = isOverdue(date.event_date);
              return (
                <li
                  key={date.id}
                  className={`dashboard-list-item ${overdue ? 'overdue' : ''}`}
                  style={{ borderLeftColor: color }}
                  onClick={() => navigate(`/subjects/${date.subject_id}`)}
                >
                  <div className="item-main">
                    <span
                      className="item-subject-pill"
                      style={{
                        color: color,
                        backgroundColor: `${color}14`,
                        borderColor: `${color}35`,
                      }}
                    >
                      {date.subject_name}
                    </span>
                    <span className="item-title">{date.title}</span>
                  </div>
                  <span className={`item-tag ${overdue ? 'tag-overdue' : 'tag-upcoming'}`}>
                    {formatDateDistance(date.event_date)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
