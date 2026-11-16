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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="page-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="page-content">
          <h1>Subjects</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            Manage your subjects
          </p>

          <SubjectForm onAdd={handleAdd} />

          {loading ? (
            <p>Loading...</p>
          ) : subjects.length === 0 ? (
            <p className="subjects-empty">
              No subjects yet — add one above to get started.
            </p>
          ) : (
            <div className="subjects-grid">
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubjectsPage;