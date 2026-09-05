import api from './axios';

export const getAttachments = (noteId) =>
  api.get(`/attachments?note_id=${noteId}`).then(res => res.data);

export const createAttachment = (data) =>
  api.post('/attachments', data).then(res => res.data);

export const deleteAttachment = (id) =>
  api.delete(`/attachments/${id}`).then(res => res.data);