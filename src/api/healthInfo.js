import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true
});

// React Query용 키 상수
export const QUERY_KEYS = {
  HEALTH_INFO: 'healthInfo',
  HEALTH_INFO_LIST: 'healthInfoList',
  HEALTH_INFO_SEARCH: 'healthInfoSearch',
};

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API 요청 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('인증이 필요하거나 만료되었습니다');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 건강정보 목록 조회
export const getHealthInfoList = async (searchParams = {}) => {
  const response = await api.get('/api/health-info', { 
    params: searchParams 
  });
  return response.data;
};

// 건강정보 저장
export const createHealthInfo = async (data) => {
  const response = await api.post('/api/health-info', data);
  return response.data;
};

// 단일 건강정보 조회
export const getHealthInfo = async (id) => {
  const response = await api.get(`/api/health-info/${id}`);
  return response.data;
};

// 건강정보 수정
export const updateHealthInfo = async (id, data) => {
  const response = await api.put(`/api/health-info/${id}`, data);
  return response.data;
};

// 건강정보 삭제
export const deleteHealthInfo = async (id) => {
  const response = await api.delete(`/api/health-info/${id}`);
  return response.data;
};

// 건강정보 검색
export const searchHealthInfo = async (searchParams) => {
  const response = await api.get('/api/health-info/search', { 
    params: searchParams 
  });
  return response.data;
};

// 건강정보 엑셀 내보내기
export const exportHealthInfo = async (searchParams = {}) => {
  const response = await api.get('/api/health-info/export', {
    params: searchParams,
    responseType: 'blob'
  });
  return response.data;
};

// 다중 삭제
export const deleteMultipleHealthInfo = async (ids) => {
  const response = await api.post('/api/health-info/multiple-delete', { ids });
  return response.data;
};

export default api;