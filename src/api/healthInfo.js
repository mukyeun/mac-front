import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true
});

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
  try {
    const response = await api.get('/api/health-info', { 
      params: searchParams 
    });
    console.log('건강정보 목록 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('건강정보 목록 조회 실패:', error);
    throw error;
  }
};

// 건강정보 저장
export const createHealthInfo = async (data) => {
  try {
    console.log('건강정보 저장 요청:', data);
    const response = await api.post('/api/health-info', data);
    console.log('건강정보 저장 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('건강정보 저장 실패:', error);
    throw error;
  }
};

// 단일 건강정보 조회
export const getHealthInfo = async (id) => {
  try {
    const response = await api.get(`/api/health-info/${id}`);
    console.log('건강정보 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('건강정보 조회 실패:', error);
    throw error;
  }
};

// 건강정보 수정
export const updateHealthInfo = async (id, data) => {
  try {
    console.log('건강정보 수정 요청:', { id, data });
    const response = await api.put(`/api/health-info/${id}`, data);
    console.log('건강정보 수정 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('건강정보 수정 실패:', error);
    throw error;
  }
};

// 건강정보 삭제
export const deleteHealthInfo = async (id) => {
  try {
    const response = await api.delete(`/api/health-info/${id}`);
    console.log('건강정보 삭제 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('건강정보 삭제 실패:', error);
    throw error;
  }
};

// 건강정보 검색
export const searchHealthInfo = async (searchParams) => {
  try {
    const response = await api.get('/api/health-info/search', { 
      params: searchParams 
    });
    console.log('건강정보 검색 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('건강정보 검색 실패:', error);
    throw error;
  }
};

// 건강정보 엑셀 내보내기
export const exportHealthInfo = async (searchParams = {}) => {
  try {
    const response = await api.get('/api/health-info/export', {
      params: searchParams,
      responseType: 'blob'
    });
    console.log('엑셀 내보내기 성공');
    return response.data;
  } catch (error) {
    console.error('엑셀 내보내기 실패:', error);
    throw error;
  }
};

// 다중 삭제
export const deleteMultipleHealthInfo = async (ids) => {
  try {
    const response = await api.post('/api/health-info/multiple-delete', { ids });
    console.log('다중 삭제 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('다중 삭제 실패:', error);
    throw error;
  }
};
