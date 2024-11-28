import axios from 'axios';

// 임시로 하드코딩
const BASE_URL = 'http://localhost:5000/api';
console.log('Using API Base URL:', BASE_URL);

// axios 기본 설정
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// 요청 인터셉터 추가
axios.interceptors.request.use(
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

// 응답 인터셉터 추가
axios.interceptors.response.use(
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

// 인증 관련 서비스
export const authService = {
  // 로그인
  async login(credentials) {
    try {
      const response = await axios.post('/users/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    } catch (error) {
      console.error('로그인 에러:', error);
      throw new Error(error.response?.data?.message || '로그인에 실패했습니다.');
    }
  },

  // 회원가입
  async register(userData) {
    try {
      const fullUrl = `${BASE_URL}/users/register`;
      console.log('Attempting to register at:', fullUrl);
      console.log('With data:', userData);
      
      const response = await axios.post('/users/register', userData);
      console.log('Register success:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register error:', {
        url: `${BASE_URL}/users/register`,
        error: error,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || '회원가입에 실패했습니다.');
    }
  },

  // 로그아웃
  async logout() {
    try {
      await axios.post('/users/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('로그아웃 에러:', error);
      throw new Error(error.response?.data?.message || '로그아웃에 실패했습니다.');
    }
  },

  // 토큰 검증
  async verifyToken() {
    try {
      const response = await axios.get('/users/verify');
      return response.data;
    } catch (error) {
      console.error('토큰 검증 에러:', error);
      throw new Error(error.response?.data?.message || '인증에 실패했습니다.');
    }
  }
};

// 건강 정보 관련 서비스
export const healthInfoService = {
  // 목록 조회
  async getList(params = {}) {
    try {
      const response = await axios.get('/health-info', { params });
      console.log('API 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('API 에러:', error);
      throw new Error(error.response?.data?.message || '데이터를 불러오는데 실패했습니다.');
    }
  },

  // 생성
  async create(data) {
    try {
      console.log('요청 데이터:', data);
      const response = await axios.post('/health-info', data);
      console.log('응답 데이터:', response.data);
      return response.data;
    } catch (error) {
      console.error('저장 에러:', error);
      throw new Error(error.response?.data?.message || '저장에 실패했습니다.');
    }
  },

  // 수정
  async update(id, data) {
    try {
      const response = await axios.put(`/health-info/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '수정에 실패했습니다.');
    }
  },

  // 삭제
  async delete(id) {
    try {
      await axios.delete(`/health-info/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || '삭제에 실패했습니다.');
    }
  }
};

export default {
  auth: authService,
  healthInfo: healthInfoService
};