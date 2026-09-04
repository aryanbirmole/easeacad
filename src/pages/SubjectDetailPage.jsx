import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import NoteCard from '../components/notes/NoteCard';
import NoteFormModal from '../components/notes/NoteFormModal';
import NoteViewModal from '../components/notes/NoteViewModal';
import { getSubjectById } from '../api/subjects';
import { getNotes, createNote } from '../api/notes';
import { getTasks, updateTask, deleteTask } from '../api/tasks';
import TasksSection from '../components/tasks/TasksSection';
import TaskFormModal from '../components/tasks/TaskFormModal';

function groupByTag(notes) {
  const groups = {};
  notes.forEach((note) => {
    const tags = note.tags ? note.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
    const section = tags[0] || 'General';
    if (!groups[section]) groups[section] = [];
    groups[section].push(note);
  });
  return groups;
}

function SubjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeNote, setActiveNote] = useState(null);

  const fetchData = async () => {
    try {
      const [subjectData, notesData, tasksData] = await Promise.all([
        getSubjectById(id),
        getNotes(id),
        getTasks(id),
      ]);
      setSubject(subjectData);
      setNotes(notesData);
      setTasks(tasksData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddNote = async (title, content, tags) => {
    const newNote = await createNote(id, title, content, tags);
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleNoteUpdated = (updatedNote) => {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
    setActiveNote(updatedNote);
  };

  const handleNoteDeleted = (noteId) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    setActiveNote(null);
  };

  const handleToggleTask = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { status: newStatus });
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleEditTask = (task) => {
  setEditingTask(task);
  setTaskModalOpen(true);
};

const handleTaskSaved = (savedTask) => {
  setTasks(prev => {
    const exists = prev.some(t => t.id === savedTask.id);
    return exists
      ? prev.map(t => t.id === savedTask.id ? savedTask : t)
      : [...prev, savedTask];
  });
};

  const groupedNotes = groupByTag(notes);

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '26px', position: 'relative' }}>
          <button
            onClick={() => navigate('/subjects')}
            style={{
              background: 'none', border: 'none', color: 'var(--color-primary)',
              cursor: 'pointer', marginBottom: '16px', padding: 0, fontSize: '14px',
            }}
          >
            ← Back to Subjects
          </button>

          {loading ? (
            <p>Loading...</p>
          ) : subject ? (
            <>
              <h1>{subject.name}</h1>

              {notes.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  No notes yet — click + to add one.
                </p>
              ) : (
                Object.entries(groupedNotes).map(([section, sectionNotes]) => (
                  <div key={section} style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', color: 'var(--color-text-main)', marginBottom: '10px' }}>
                      {section}
                    </h3>
                    {sectionNotes.map((note) => (
                      <NoteCard key={note.id} note={note} onClick={setActiveNote} />
                    ))}
                  </div>
                ))
              )}

              <TasksSection
                tasks={tasks}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
                onAddClick={() => { setEditingTask(null); setTaskModalOpen(true); }}
              />

              <button
                onClick={() => setShowAddModal(true)}
                title="Add Note"
                style={{
                  position: 'fixed', bottom: '32px', right: '32px',
                  width: '56px', height: '56px', borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)', color: 'var(--color-white)',
                  border: 'none', fontSize: '28px', cursor: 'pointer',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                +
              </button>
            </>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Subject not found.
            </p>
          )}
        </div>
      </div>

      {showAddModal && (
        <NoteFormModal onAdd={handleAddNote} onClose={() => setShowAddModal(false)} />
      )}

      {activeNote && (
        <NoteViewModal
          note={activeNote}
          onClose={() => setActiveNote(null)}
          onUpdated={handleNoteUpdated}
          onDeleted={handleNoteDeleted}
        />
      )}

      {taskModalOpen && (
        <TaskFormModal
          subjectId={id}
          task={editingTask}
          onClose={() => setTaskModalOpen(false)}
          onSaved={handleTaskSaved}
        />
)}
      
    </div>
  );
}

export default SubjectDetailPage;