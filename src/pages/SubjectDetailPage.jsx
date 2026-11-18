import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Icon from '../components/common/Icon';
import '../styles/layout.css';
import './SubjectDetailPage.css';
import NoteCard from '../components/notes/NoteCard';
import NoteFormModal from '../components/notes/NoteFormModal';
import NoteViewModal from '../components/notes/NoteViewModal';
import { getSubjectById } from '../api/subjects';
import { getNotes, createNote } from '../api/notes';
import { getTasks, updateTask, deleteTask } from '../api/tasks';
import TasksSection from '../components/tasks/TasksSection';
import TaskFormModal from '../components/tasks/TaskFormModal';
import { getImportantDates, updateImportantDate, deleteImportantDate } from '../api/importantDates';
import ImportantDatesSection from '../components/importantDates/ImportantDatesSection';
import ImportantDateFormModal from '../components/importantDates/ImportantDateFormModal';

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
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [editingDate, setEditingDate] = useState(null);
  const [taskActionError, setTaskActionError] = useState('');
  const taskToggleRequests = useRef(new Set());

  const fetchData = async () => {
  try {
      const [subjectData, notesData, tasksData, datesData] = await Promise.all([
        getSubjectById(id),
        getNotes(id),
        getTasks(id),
        getImportantDates(id),
      ]);
      setSubject(subjectData);
      setNotes(notesData);
      setTasks(tasksData);
      setDates(datesData);
      setLoadError(false);
    } catch (err) {
      console.error(err);
      setLoadError(true);
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
    if (taskToggleRequests.current.has(task.id)) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    taskToggleRequests.current.add(task.id);
    setTaskActionError('');
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: newStatus } : t));

    try {
      await updateTask(task.id, { status: newStatus });
    } catch (err) {
      console.error(err);
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: task.status } : t));
      setTaskActionError('Could not update task completion. Please try again.');
    } finally {
      taskToggleRequests.current.delete(task.id);
    }
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

  const handleToggleDate = async (date) => {
    const newDone = !date.is_done;
    await updateImportantDate(date.id, { is_done: newDone });
    setDates(dates.map(d => d.id === date.id ? { ...d, is_done: newDone } : d));
  };

  const handleDeleteDate = async (dateId) => {
    await deleteImportantDate(dateId);
    setDates(dates.filter(d => d.id !== dateId));
  };

  const handleEditDate = (date) => {
    setEditingDate(date);
    setDateModalOpen(true);
  };

  const handleDateSaved = (savedDate) => {
    setDates(prev => {
      const exists = prev.some(d => d.id === savedDate.id);
      return exists
        ? prev.map(d => d.id === savedDate.id ? savedDate : d)
        : [...prev, savedDate];
    });
  };

  const groupedNotes = groupByTag(notes);

  return (
    <div>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="page-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="page-content page-content--relative">
          <button
            className="back-button"
            onClick={() => navigate('/subjects')}
          >
            <Icon name="arrowLeft" size={16} />
            Back to Subjects
          </button>

          {loading ? (
            <p>Loading...</p>
          ) : subject ? (
            <>
              <div
                className="subject-detail-hero"
                style={{
                  borderLeftColor: subject.color || 'var(--color-ui-accent-primary)',
                  background: `linear-gradient(135deg, ${subject.color || 'var(--color-ui-accent-primary)'}12 0%, transparent 70%)`
                }}
              >
                <div className="subject-detail-hero-info">
                  <div className="subject-detail-hero-badge">
                    <span
                      className="subject-hero-dot"
                      style={{ backgroundColor: subject.color || 'var(--color-ui-accent-primary)' }}
                    />
                    <span
                      className="subject-hero-type"
                      style={{ color: subject.color || 'var(--color-ui-accent-primary)' }}
                    >
                      Course Workspace
                    </span>
                  </div>
                  <h1 className="subject-detail-heading">{subject.name}</h1>
                </div>
              </div>

              <div className="notes-section">
                <div className="notes-header">
                  <h2>Notes</h2>
                  <button
                    className="add-note-btn"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Icon name="plus" size={16} />
                    <span>Add Note</span>
                  </button>
                </div>

                {notes.length === 0 ? (
                  <div className="notes-empty-state">
                    <p>No notes yet — click Add Note to create your first lecture or study note.</p>
                  </div>
                ) : (
                  Object.entries(groupedNotes).map(([section, sectionNotes]) => (
                    <div key={section} className="notes-group">
                      <h3 className="notes-group-title">
                        {section}
                      </h3>
                      {sectionNotes.map((note) => (
                        <NoteCard key={note.id} note={note} onClick={setActiveNote} />
                      ))}
                    </div>
                  ))
                )}
              </div>

              <TasksSection
                tasks={tasks}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
                onAddClick={() => { setEditingTask(null); setTaskModalOpen(true); }}
                actionError={taskActionError}
              />

              <ImportantDatesSection
                dates={dates}
                onToggle={handleToggleDate}
                onDelete={handleDeleteDate}
                onEdit={handleEditDate}
                onAddClick={() => { setEditingDate(null); setDateModalOpen(true); }}
              />
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

      {dateModalOpen && (
        <ImportantDateFormModal
          subjectId={id}
          date={editingDate}
          onClose={() => setDateModalOpen(false)}
          onSaved={handleDateSaved}
        />
      )}
    </div>
  );
}

export default SubjectDetailPage;