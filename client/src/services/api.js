import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data)
};

// Room API
export const roomAPI = {
  create: (data) => api.post('/rooms', data),
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
  join: (inviteCode) => api.post('/rooms/join', { inviteCode }),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  removeMember: (roomId, userId) => api.delete(`/rooms/${roomId}/members/${userId}`)
};

// Expense API
export const expenseAPI = {
  create: (data) => api.post('/expenses', data),
  getByRoom: (roomId) => api.get(`/expenses/room/${roomId}`),
  getBalances: (roomId) => api.get(`/expenses/room/${roomId}/balances`),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  settle: (id, userId) => api.put(`/expenses/${id}/settle/${userId}`),
  delete: (id) => api.delete(`/expenses/${id}`)
};

// Task API
export const taskAPI = {
  create: (data) => api.post('/tasks', data),
  getByRoom: (roomId, status) => api.get(`/tasks/room/${roomId}${status ? `?status=${status}` : ''}`),
  getMyTasks: (status) => api.get(`/tasks/my-tasks${status ? `?status=${status}` : ''}`),
  updateStatus: (id, status) => api.put(`/tasks/${id}/status`, { status }),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  rotate: (roomId) => api.post(`/tasks/room/${roomId}/rotate`)
};

export default api;
