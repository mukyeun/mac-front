import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// 로그인 API
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

// 로그아웃
export const logout = () => {
  localStorage.removeItem('token');
};

// 토큰 검증
export const verifyToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const response = await axios.get(`${API_URL}/api/users/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.success;
  } catch (error) {
    console.error('토큰 검증 실패:', error);
    return false;
  }
};
