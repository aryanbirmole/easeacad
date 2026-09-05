import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { searchAll } from '../../api/search';
import ChangePasswordModal from './ChangePasswordModal';
import ChangeNameModal from './ChangeNameModal';
import './Navbar.css';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeName, setShowChangeName] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
  if (searchQuery.trim() === '') {
    setSearchResults(null);
    setIsSearching(false);
    return;
  }

  setIsSearching(true);

  const timer = setTimeout(async () => {
    try {
      const data = await searchAll(searchQuery.trim());
      setSearchResults(data);
    } catch (err) {
      console.error(err);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (subjectId) => {
    setSearchQuery('');
    setSearchResults(null);
    navigate(`/subjects/${subjectId}`);
  };

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      logout();
      navigate('/login');
    }
  };

  const hasResults =
    searchResults &&
    (searchResults.subjects.length > 0 ||
      searchResults.notes.length > 0 ||
      searchResults.tasks.length > 0 ||
      searchResults.dates.length > 0);

  return (
    <nav className="navbar">
      <span className="navbar-title">EaseAcad</span>

      <div className="navbar-search-wrapper">
        <input
          type="text"
          className="navbar-search-input"
          placeholder="Search subjects, notes, tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {searchQuery.trim() !== '' && (
          <div className="navbar-search-dropdown">
            {isSearching ? (
              <p className="navbar-search-empty">Searching...</p>
            ) : !hasResults ? (
              <p className="navbar-search-empty">No results found.</p>
            ) : (
              <>
                {searchResults.subjects.length > 0 && (
                  <div className="navbar-search-group">
                    <h4>Subjects</h4>
                    {searchResults.subjects.map((s) => (
                      <div key={s.id} className="navbar-search-item" onClick={() => handleResultClick(s.id)}>
                        {s.name}
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.notes.length > 0 && (
                  <div className="navbar-search-group">
                    <h4>Notes</h4>
                    {searchResults.notes.map((n) => (
                      <div key={n.id} className="navbar-search-item" onClick={() => handleResultClick(n.subject_id)}>
                        {n.title} <span className="navbar-search-context">in {n.subject_name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.tasks.length > 0 && (
                  <div className="navbar-search-group">
                    <h4>Tasks</h4>
                    {searchResults.tasks.map((t) => (
                      <div key={t.id} className="navbar-search-item" onClick={() => handleResultClick(t.subject_id)}>
                        {t.title} <span className="navbar-search-context">in {t.subject_name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.dates.length > 0 && (
                  <div className="navbar-search-group">
                    <h4>Important Dates</h4>
                    {searchResults.dates.map((d) => (
                      <div key={d.id} className="navbar-search-item" onClick={() => handleResultClick(d.subject_id)}>
                        {d.title} <span className="navbar-search-context">in {d.subject_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="navbar-profile-wrapper">
        <div className="navbar-profile" onClick={() => setShowDropdown(!showDropdown)}>
          <span className="navbar-avatar">👤</span>
          <span className="navbar-username">{user?.name}</span>
        </div>
        {showDropdown && (
          <div className="navbar-dropdown">
            <div onClick={() => { setShowChangeName(true); setShowDropdown(false); }}>
              Change Name
            </div>
            <div onClick={() => { setShowChangePassword(true); setShowDropdown(false); }}>
              Change Password
            </div>
            <div onClick={handleLogout}>Log out</div>
          </div>
        )}
      </div>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
      {showChangeName && (
        <ChangeNameModal onClose={() => setShowChangeName(false)} />
      )}
    </nav>
  );
}

export default Navbar;