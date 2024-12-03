import axios from 'axios';
import { tokenService } from '../utils/tokenService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// axios 인스턴스 생성
const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 추가
authApi.interceptors.request.use(
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

// 응답 인터셉터 - 토큰 만료 처리
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      tokenService.clearAll();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // 로그인
  async login(credentials) {
    try {
      const response = await authApi.post('/login', credentials);
      const { token, user } = response.data;
      
      tokenService.setToken(token);
      tokenService.setUser(user);
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '로그인 중 오류가 발생했습니다.');
    }
  },

  // 회원가입
  async register(userData) {
    try {
      const response = await authApi.post('/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    }
  },

  // 로그아웃
  async logout() {
    try {
      await authApi.post('/logout');
      tokenService.clearAll();
    } catch (error) {
      console.error('Logout error:', error);
      // 에러가 발생하더라도 로컬의 인증 정보는 삭제
      tokenService.clearAll();
      throw new Error('로그아웃 중 오류가 발생했습니다.');
    }
  },

  // 사용자 정보 조회
  async getUserInfo() {
    try {
      const response = await authApi.get('/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '사용자 정보 조회 중 오류가 발생했습니다.');
    }
  },

  // 비밀번호 변경
  async changePassword(passwordData) {
    try {
      const response = await authApi.post('/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.');
    }
  },

  // 이메일 인증 요청
  async requestEmailVerification() {
    try {
      const response = await authApi.post('/email-verification/request');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '이메일 인증 요청 중 오류가 발생했습니다.');
    }
  },

  // 이메일 인증 확인
  async verifyEmail(token) {
    try {
      const response = await authApi.post('/email-verification/verify', { token });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '이메일 인증 중 오류가 발생했습니다.');
    }
  }
};

export default authAPI;
