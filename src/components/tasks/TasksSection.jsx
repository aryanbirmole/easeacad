import { groupTasks } from '../../utils/groupTasks';
import TaskItem from './TaskItem';
import './TasksSection.css';

function TaskGroup({ label, tasks, onToggle, onDelete, onEdit }) {
  if (tasks.length === 0) return null;
  return (
    <div className="task-group">
      <h3 className="task-group-label">{label}</h3>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}

function TasksSection({ tasks, onToggle, onDelete, onEdit, onAddClick }) {
  const { overdue, dueToday, upcoming, completed } = groupTasks(tasks);

  return (
    <div className="tasks-section">
      <div className="tasks-header">
        <h2>Tasks</h2>
        <button className="add-task-btn" onClick={onAddClick}>+ Add Task</button>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <>
          <TaskGroup label="Overdue" tasks={overdue} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
          <TaskGroup label="Due Today" tasks={dueToday} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
          <TaskGroup label="Upcoming" tasks={upcoming} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
          <TaskGroup label="Completed" tasks={completed} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
        </>
      )}
    </div>
  );
}

export default TasksSection;