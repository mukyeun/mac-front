import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import tokenService from '../utils/token';

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(tokenService.getUser());

  // 로그인 처리
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.post('/api/users/login', {
        email,
        password
      });

      const { token, user: userData } = response.data.data;
      
      // 토큰과 사용자 정보 저장
      tokenService.setToken(token);
      tokenService.setUser(userData);
      setUser(userData);

      // 메인 페이지로 이동
      navigate('/');
      
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // 로그아웃 처리
  const logout = useCallback(() => {
    tokenService.clearAll();
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // 인증 상태 확인
  const isAuthenticated = useCallback(() => {
    return !!tokenService.getToken();
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated
  };
};

export default useAuth;
