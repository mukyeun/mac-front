import apiClient from './apiClient';
import { tokenService } from '../utils/token';

export const authService = {
  // 로그인
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, refreshToken, user } = response.data;
      tokenService.setToken(token);
      tokenService.setUser(user);
      localStorage.setItem('refreshToken', refreshToken);
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || '로그인에 실패했습니다.');
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    } finally {
      tokenService.clearAll();
      localStorage.removeItem('refreshToken');
    }
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '사용자 정보를 가져오는데 실패했습니다.');
    }
  },

  // 회원가입
  register: async (userData) => {
    try {
      const response = await apiClient.post('/users/register', userData);
      const { token, user } = response.data;
      if (token) {
        tokenService.setToken(token);
        tokenService.setUser(user);
      }
      return { token, user };
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      throw new Error(error.response?.data?.message || '회원가입에 실패했습니다.');
    }
  },

  // 비밀번호 변경
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    }
  },

  // 토큰 갱신
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/auth/refresh-token');
      const { token } = response.data;
      tokenService.setToken(token);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '토큰 갱신에 실패했습니다.');
    }
  }
};

export default authService;