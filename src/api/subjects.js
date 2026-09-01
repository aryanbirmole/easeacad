import api from './axios';

export const getSubjects = async () => {
  const res = await api.get('/subjects');
  return res.data.subjects;
};

export const createSubject = async (name, color) => {
  const res = await api.post('/subjects', { name, color });
  return res.data.subject;
};

export const updateSubject = async (id, name, color) => {
  const res = await api.put(`/subjects/${id}`, { name, color });
  return res.data;
};

export const deleteSubject = async (id) => {
  const res = await api.delete(`/subjects/${id}`);
  return res.data;
};

export const getSubjectById = async (id) => {
  const res = await api.get(`/subjects/${id}`);
  return res.data.subject;
};