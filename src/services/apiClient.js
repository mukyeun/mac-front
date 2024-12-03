import axios from 'axios';
import { tokenService } from '../utils/tokenService';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest._retry) {
      tokenService.clearAll();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await apiClient.post('/auth/refresh-token', { refreshToken });
        const newToken = response.data.token;
        
        if (!newToken) {
          throw new Error('No token received');
        }

        tokenService.setToken(newToken);
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        tokenService.clearAll();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    if (!error.response) {
      console.error('Network error:', error);
    }

    return Promise.reject(error);
  }
);

apiClient.handleError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return `잘못된 요청입니다: ${data.message}`;
      case 404:
        return '요청한 리소스를 찾을 수 없습니다.';
      case 500:
        return '서버 오류가 발생했습니다.';
      default:
        return '알 수 없는 오류가 발생했습니다.';
    }
  }
  return '네트워크 오류가 발생했습니다.';
};

export default apiClient;