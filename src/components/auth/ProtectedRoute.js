import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { tokenService } from '../../utils/tokenService';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // 인증 상태 로딩 중
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // 인증되지 않은 경우
  if (!isAuthenticated) {
    // 현재 시도한 경로를 state로 전달하여 로그인 후 리다이렉트할 수 있도록 함
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 특정 역할이 필요한 경우 역할 검사
  if (requiredRole && (!user.role || user.role !== requiredRole)) {
    return <Navigate to="/" replace />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;
