import apiClient from './apiClient';

export const healthService = {
  // 건강정보 목록 조회
  getHealthInfoList: async (params) => {
    const response = await apiClient.get('/health-info', { params });
    return response.data;
  },

  // 건강정보 상세 조회
  getHealthInfo: async (id) => {
    const response = await apiClient.get(`/health-info/${id}`);
    return response.data;
  },

  // 건강정보 생성
  createHealthInfo: async (data) => {
    const response = await apiClient.post('/health-info', data);
    return response.data;
  },

  // 건강정보 수정
  updateHealthInfo: async (id, data) => {
    const response = await apiClient.put(`/health-info/${id}`, data);
    return response.data;
  },

  // 건강정보 삭제
  deleteHealthInfo: async (id) => {
    const response = await apiClient.delete(`/health-info/${id}`);
    return response.data;
  },

  // 건강정보 통계
  getHealthStats: async (params) => {
    const response = await apiClient.get('/health-info/stats', { params });
    return response.data;
  },

  // 건강정보 검색
  searchHealthInfo: async (searchParams) => {
    const response = await apiClient.get('/health-info/search', { params: searchParams });
    return response.data;
  },

  // 건강정보 필터링
  filterHealthInfo: async (filterParams) => {
    const response = await apiClient.get('/health-info/filter', { params: filterParams });
    return response.data;
  }
};

export default healthService;