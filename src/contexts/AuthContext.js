import { createContext, useContext, useState, useCallback } from 'react';
import axiosInstance from '../utils/axios';
import tokenService from '../utils/token';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(tokenService.getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post('/api/users/login', {
        email,
        password
      });

      const { token, user } = response.data.data;
      tokenService.setToken(token);
      tokenService.setUser(user);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || '로그인 중 오류가 발생했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post('/api/users/register', userData);
      
      const { token, user } = response.data.data;
      tokenService.setToken(token);
      tokenService.setUser(user);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    tokenService.clearAll();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;