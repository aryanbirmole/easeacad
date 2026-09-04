export function groupTasks(tasks) {
  const today = new Date().setHours(0, 0, 0, 0);

  const overdue = [];
  const dueToday = [];
  const upcoming = [];
  const completed = [];

  tasks.forEach(task => {
    if (task.status === 'completed') {
      completed.push(task);
      return;
    }
    if (!task.due_date) {
      upcoming.push(task);
      return;
    }
    const due = new Date(task.due_date).setHours(0, 0, 0, 0);
    if (due < today) overdue.push(task);
    else if (due === today) dueToday.push(task);
    else upcoming.push(task);
  });

  return { overdue, dueToday, upcoming, completed };
}