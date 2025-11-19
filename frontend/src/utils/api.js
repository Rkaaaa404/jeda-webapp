import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Task API
export const taskAPI = {
  getTasks: () => api.get('/tasks'),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  completeTask: (id, formData) => {
    return api.put(`/tasks/${id}/complete`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteTask: (id) => api.delete(`/tasks/${id}`)
};

// Session API
export const sessionAPI = {
  startSession: (data) => api.post('/sessions/start', data),
  stopSession: () => api.post('/sessions/stop'),
  getActiveSession: () => api.get('/sessions/active'),
  getSessionHistory: (params) => api.get('/sessions', { params })
};

// Leaderboard API
export const leaderboardAPI = {
  getStreakLeaderboard: () => api.get('/leaderboard/streak'),
  getSessionLeaderboard: (range) => api.get('/leaderboard/sessions', { params: { range } })
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard')
};

// Settings API
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data)
};

export default api;
