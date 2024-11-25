import axios from 'axios';
import tokenService from './token';

const baseURL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      tokenService.clearAll();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (data) => axiosInstance.post('/users/login', data),
  register: (data) => axiosInstance.post('/users/register', data),
  verify: () => axiosInstance.get('/users/verify'),
  logout: () => axiosInstance.post('/users/logout')
};

export const healthInfoAPI = {
  getAll: (params) => axiosInstance.get('/health-info', { params }),
  getOne: (id) => axiosInstance.get(`/health-info/${id}`),
  create: (data) => axiosInstance.post('/health-info', data),
  update: (id, data) => axiosInstance.put(`/health-info/${id}`, data),
  delete: (id) => axiosInstance.delete(`/health-info/${id}`)
};

export default axiosInstance;