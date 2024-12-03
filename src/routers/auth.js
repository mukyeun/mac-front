import Login from '../pages/Login';
import LoginPage from '../components/LoginPage';

export const authRoutes = [
  {
    path: '/login',
    element: <LoginPage />
  },
  // 추가 인증 관련 라우트가 필요하다면 여기에 추가
];

// App.js에서 기존 라우트와 함께 사용할 수 있도록 export
export const getAuthRoutes = () => {
  return authRoutes.map(route => ({
    ...route,
    element: route.element
  }));
};