import axios from 'axios';
import { tokenService } from '../utils/token';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
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

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 처리
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await apiClient.post('/auth/refresh-token', { refreshToken });
          const newToken = response.data.token;
          tokenService.setToken(newToken);
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(error.config);
        }
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우
        tokenService.clearAll();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;