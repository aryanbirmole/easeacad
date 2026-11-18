import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import './Sidebar.css';

function Sidebar({ isOpen, onClose }) {
  const [isDark, setIsDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');

  const handleThemeToggle = () => {
    const theme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    setIsDark(theme === 'dark');
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Pomodoro Focus Timer
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('focus'); // 'focus' | 'break'
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
      if (timerMode === 'focus') {
        alert('🎉 Focus session complete! Take a 5-minute break.');
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        alert('⏰ Break finished! Ready for another focus session?');
        setTimerMode('focus');
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds, timerMode]);

  const toggleTimerRunning = () => setTimerRunning(!timerRunning);

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(timerMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTimerTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-nav">
          <div className="sidebar-section-title">Academic Space</div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? 'sidebar-link active active-dashboard' : 'sidebar-link')}
            onClick={onClose}
          >
            <Icon name="dashboard" size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/subjects"
            className={({ isActive }) => (isActive ? 'sidebar-link active active-courses' : 'sidebar-link')}
            onClick={onClose}
          >
            <Icon name="bookOpen" size={18} />
            <span>Courses</span>
          </NavLink>
        </div>

        <div className="sidebar-footer">
          {/* Today's Date */}
          <div className="sidebar-date-pill" title="Today's Date">
            <Icon name="calendar" size={15} />
            <span className="sidebar-date-text">{todayFormatted}</span>
          </div>

          {/* Pomodoro Focus Timer Widget */}
          <div className="sidebar-pomodoro-wrapper">
            <button
              className={`sidebar-pomodoro-toggle ${showTimer ? 'active' : ''} ${timerRunning ? (timerMode === 'focus' ? 'active-focus' : 'active-break') : ''}`}
              type="button"
              onClick={() => setShowTimer(!showTimer)}
              title="Toggle Focus Timer"
            >
              <span className="pomodoro-title-group">
                <span className="pomodoro-dot" style={{ backgroundColor: timerRunning ? 'var(--color-success)' : 'var(--color-text-muted)' }}></span>
                <span>Focus Timer</span>
              </span>
              <span className="sidebar-pomodoro-readout font-mono">{formatTimerTime(timerSeconds)}</span>
            </button>

            {showTimer && (
              <div className="sidebar-pomodoro-panel">
                <div className="sidebar-pomodoro-modes">
                  <button
                    type="button"
                    className={`pomodoro-mode-btn ${timerMode === 'focus' ? 'active' : ''}`}
                    onClick={() => { setTimerMode('focus'); setTimerSeconds(25 * 60); setTimerRunning(false); }}
                  >
                    25m Focus
                  </button>
                  <button
                    type="button"
                    className={`pomodoro-mode-btn ${timerMode === 'break' ? 'active' : ''}`}
                    onClick={() => { setTimerMode('break'); setTimerSeconds(5 * 60); setTimerRunning(false); }}
                  >
                    5m Break
                  </button>
                </div>

                <div className="sidebar-pomodoro-controls">
                  <button
                    type="button"
                    className={`pomodoro-action-btn ${timerRunning ? 'pause' : 'start'}`}
                    onClick={toggleTimerRunning}
                  >
                    {timerRunning ? 'Pause' : 'Start'}
                  </button>
                  <button type="button" className="pomodoro-reset-btn" onClick={resetTimer} title="Reset Timer">
                    ↺
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Mode Button */}
          <button className="sidebar-theme-btn" type="button" onClick={handleThemeToggle}>
            <Icon name={isDark ? 'sun' : 'moon'} size={16} />
            <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
