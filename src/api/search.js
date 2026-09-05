import api from './axios';

export const searchAll = (query) =>
  api.get(`/search?q=${encodeURIComponent(query)}`).then(res => res.data);