import api from './axios';

export const getNotes = async (subjectId) => {
  const res = await api.get(`/notes?subject_id=${subjectId}`);
  return res.data.notes;
};

export const createNote = async (subjectId, title, content, tags) => {
  const res = await api.post('/notes', { subject_id: subjectId, title, content, tags });
  return res.data.note;
};

export const updateNote = async (id, fields) => {
  const res = await api.put(`/notes/${id}`, fields);
  return res.data;
};

export const deleteNote = async (id) => {
  const res = await api.delete(`/notes/${id}`);
  return res.data;
};