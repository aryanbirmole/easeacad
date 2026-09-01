import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { getSubjectById } from '../api/subjects';

function SubjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const data = await getSubjectById(id);
        setSubject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '26px' }}>
          <button
            onClick={() => navigate('/subjects')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              marginBottom: '16px',
              padding: 0,
              fontSize: '14px',
            }}
          >
            ← Back to Subjects
          </button>

          {loading ? (
            <p>Loading...</p>
          ) : subject ? (
            <>
              <h1>{subject.name}</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                Notes and tasks for this subject will appear here once those modules are built.
              </p>
            </>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Subject not found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubjectDetailPage;