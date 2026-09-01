import api from './axios';

export const registerUser = async (name, email, password) => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const updateName = async (name) => {
  const res = await api.put('/auth/update-name', { name });
  return res.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const res = await api.put('/auth/change-password', { currentPassword, newPassword });
  return res.data;
};