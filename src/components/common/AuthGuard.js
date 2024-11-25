import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const AuthGuard = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated) {
          navigate('/login');
        }
      } catch (error) {
        console.error('인증 확인 실패:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      checkAuth();
    }
  }, [navigate, isAuthenticated, authLoading]);

  if (isLoading || authLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : null;
};

export default AuthGuard;
