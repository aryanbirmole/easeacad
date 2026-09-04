import api from './axios';

export const getTasks = (subjectId) =>
  api.get(`/tasks?subject_id=${subjectId}`).then(res => res.data);

export const createTask = (taskData) =>
  api.post('/tasks', taskData).then(res => res.data);

export const updateTask = (id, taskData) =>
  api.put(`/tasks/${id}`, taskData).then(res => res.data);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`).then(res => res.data);