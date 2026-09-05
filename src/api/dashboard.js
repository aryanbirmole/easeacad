import api from './axios';

export const getDashboardStats = () =>
  api.get('/dashboard/stats').then(res => res.data);

export const getUpcoming = (days = 7) =>
  api.get(`/dashboard/upcoming?days=${days}`).then(res => res.data);

export const getThisWeek = () =>
  api.get('/dashboard/this-week').then(res => res.data);