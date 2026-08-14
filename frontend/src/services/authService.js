import api from './api';

export const register = (name, email, password, role) => api.post('/auth/register', { name, email, password, role });
export const login = (email, password) => api.post('/auth/login', { email, password });
export const getProfile = () => api.get('/auth/me');
export const getMe = () => api.get('/auth/me');
export const logout = () => localStorage.removeItem('token');
export const isAuthenticated = () => !!localStorage.getItem('token');
export const getToken = () => localStorage.getItem('token');

const authService = {
  register,
  login,
  getProfile,
  getMe,
  logout,
  isAuthenticated,
  getToken
};

export default authService;
