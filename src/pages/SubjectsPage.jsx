import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import '../styles/layout.css';
import SubjectCard from '../components/subjects/SubjectCard';
import SubjectForm from '../components/subjects/SubjectForm';
import { getSubjects, createSubject, deleteSubject } from '../api/subjects';
import './SubjectsPage.css';

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Initialize state from localStorage so it remembers your choice across pages
const [isDark, setIsDark] = useState(() => {
  return localStorage.getItem('theme') === 'dark';
});

// 2. Sync with the DOM and save to localStorage whenever it changes
useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
  }, [isDark]);

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAdd = async (name, color) => {
    const newSubject = await createSubject(name, color);
    setSubjects((prev) => [newSubject, ...prev]);
  };

  const handleDelete = async (id) => {
    await deleteSubject(id);
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '26px' }}>
          <h1>Subjects</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            Manage your subjects
          </p>

          <SubjectForm onAdd={handleAdd} />

          {loading ? (
            <p>Loading...</p>
          ) : subjects.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              No subjects yet — add one above to get started.
            </p>
          ) : (
            subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SubjectsPage;