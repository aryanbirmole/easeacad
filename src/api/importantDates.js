import api from './axios';

export const getImportantDates = (subjectId) =>
  api.get(`/important-dates?subject_id=${subjectId}`).then(res => res.data);

export const createImportantDate = (dateData) =>
  api.post('/important-dates', dateData).then(res => res.data);

export const updateImportantDate = (id, dateData) =>
  api.put(`/important-dates/${id}`, dateData).then(res => res.data);

export const deleteImportantDate = (id) =>
  api.delete(`/important-dates/${id}`).then(res => res.data);