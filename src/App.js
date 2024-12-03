import React, { useState } from 'react';
import { Routes, Route, NavLink as RouterNavLink, Navigate } from 'react-router-dom';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { IconButton, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { QueryClient, QueryClientProvider, useQueryClient, useMutation } from '@tanstack/react-query';
import getTheme from './styles/theme';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Home, About, Profile, Login } from './pages';
import APITest from './components/test/APITest';
import HealthInfoForm from './components/health/HealthInfoForm';
import HealthInfoList from './components/health/HealthInfoList';
import { 증상카테고리 } from './data/SymptomCategories';
import { healthInfoService } from './services/api';
import Layout from './components/layout/Layout';
import HealthInfoPage from './pages/HealthInfoPage';
import SymptomsPage from './pages/SymptomsPage';
import PrivateRoute from './components/common/PrivateRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './components/LoginPage';

// QueryClient 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const NavBar = styled.nav`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 0;
  border-bottom: 2px solid ${({ theme }) => theme.palette?.divider || '#e0e0e0'};
  background-color: ${({ theme }) => theme.palette?.background?.paper || '#ffffff'};
`;

const StyledNavLink = styled(RouterNavLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.palette?.text?.primary || '#000000'};
  padding: 1rem 2rem;
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 4px solid transparent;
  transition: all 0.3s;

  &:hover {
    color: ${({ theme }) => theme.palette?.primary?.main || '#1976d2'};
    background-color: ${({ theme }) => theme.palette?.action?.hover || 'rgba(0, 0, 0, 0.04)'};
  }

  &.active {
    color: ${({ theme }) => theme.palette?.primary?.main || '#1976d2'};
    border-bottom-color: ${({ theme }) => theme.palette?.primary?.main || '#1976d2'};
    background-color: ${({ theme }) => theme.palette?.action?.selected || 'rgba(0, 0, 0, 0.08)'};
    border-radius: 8px 8px 0 0;
    font-weight: bold;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.palette?.text?.primary || '#000000'};
  padding: 1rem 2rem;
  font-size: 1.25rem;
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.palette?.error?.main || '#d32f2f'};
  }
`;

const initialFormData = {
  기본정보: {
    이름: '',
    연락처: '',
    주민등록번호: '',
    성별: '',
    신장: '',
    체중: '',
    성격: ''
  },
  증상선택: {
    스트레스수준: '',
    노동강도: '',
    증상: []
  },
  맥파분석: {
    수축기혈압: '',
    이완기혈압: '',
    맥박수: ''
  },
  복용약물: {
    약물: [],
    기호식품: []
  },
  메모: ''
};

const ThemeToggleButton = () => {
  const { mode, toggleMode } = useTheme();
  
  return (
    <IconButton 
      onClick={toggleMode} 
      color="inherit"
      sx={{ 
        ml: 2,
        color: mode === 'dark' ? 'white' : 'black'
      }}
    >
      {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};
function AppContent() {
  console.log('AppContent rendering');
  const { mode } = useTheme();
  const theme = React.useMemo(() => getTheme(mode), [mode]);
  const { isAuthenticated, logout } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(initialFormData);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    대분류: '',
    중분류: '',
    소분류: ''
  });

  const createMutation = useMutation({
    mutationFn: (data) => healthInfoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['healthInfo']);
      alert('건강정보가 성공적으로 저장되었습니다.');
      handleReset();
    },
    onError: (error) => {
      console.error('저장 실패:', error);
      alert(`저장에 실패했습니다: ${error.message}`);
    }
  });

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const handleSubmit = async () => {
    const saveData = {
      기본정보: formData.기본정보 || {},
      증상선택: formData.증상선택 || {},
      맥파분석: {
        수축기혈압: formData.맥파분석?.수축기혈압 || '',
        이완기혈압: formData.맥파분석?.이완기혈압 || '',
        맥박수: formData.맥파분석?.맥박수 || ''
      },
      복용약물: {
        약물: formData.복용약물?.약물 || [],
        기호식품: formData.복용약물?.기호식품 || []
      },
      메모: formData.메모 || '',
      created_at: new Date().toISOString()
    };

    createMutation.mutate(saveData);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSelectedSymptoms([]);
    setSelectedCategory({
      대분류: '',
      중분류: '',
      소분류: ''
    });
  };

  const styledTheme = {
    palette: {
      mode,
      divider: theme.palette.divider,
      text: theme.palette.text,
      primary: theme.palette.primary,
      background: theme.palette.background,
      action: theme.palette.action,
      error: theme.palette.error
    }
  };

  return (
    <StyledThemeProvider theme={styledTheme}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
          <AppContainer>
            {isAuthenticated && (
              <NavBar>
                <StyledNavLink to="/">홈</StyledNavLink>
                <StyledNavLink to="/list">목록보기</StyledNavLink>
                <StyledNavLink to="/new">새 건강정보 입력</StyledNavLink>
                <StyledNavLink to="/profile">프로필</StyledNavLink>
                <StyledNavLink to="/about">About</StyledNavLink>
                <StyledNavLink to="/test">API 테스트</StyledNavLink>
                <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                  <LogoutButton onClick={logout}>로그아웃</LogoutButton>
                  <ThemeToggleButton />
                </Box>
              </NavBar>
            )}
            
            <Routes>
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              } />
              <Route path="/" element={
                !isAuthenticated ? <Navigate to="/login" replace /> : <Home />
              } />
              <Route path="/list" element={
                <PrivateRoute>
                  <HealthInfoList />
                </PrivateRoute>
              } />
              <Route path="/new" element={
                <PrivateRoute>
                  <HealthInfoForm
                    formData={formData}
                    setFormData={setFormData}
                    selectedSymptoms={selectedSymptoms}
                    setSelectedSymptoms={setSelectedSymptoms}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    handleReset={handleReset}
                    증상카테고리={증상카테고리}
                  />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/about" element={
                <PrivateRoute>
                  <About />
                </PrivateRoute>
              } />
              <Route path="/test" element={
                <PrivateRoute>
                  <APITest />
                </PrivateRoute>
              } />
            </Routes>
          </AppContainer>
        </Box>
      </MuiThemeProvider>
    </StyledThemeProvider>
  );
}

function App() {
  const theme = getTheme('light');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <AppContent />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;