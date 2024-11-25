import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink as RouterNavLink, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Home, About, Profile, Login } from './pages';
import APITest from './components/test/APITest';
import { searchData } from './utils/dataManager';
import HealthInfoForm from './components/health/HealthInfoForm';
import HealthInfoList from './components/health/HealthInfoList';
import { 증상카테고리 } from './data/SymptomCategories';
import { healthInfoService } from './services/api';
import PrivateRoute from './components/common/PrivateRoute';
import { useAuth } from './hooks/useAuth';

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
  border-bottom: 2px solid #e2e8f0;
`;

const StyledNavLink = styled(RouterNavLink)`
  text-decoration: none;
  color: #495057;
  padding: 1rem 2rem;
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 4px solid transparent;
  transition: all 0.3s;

  &:hover {
    color: #3b82f6;
    background-color: #f8f9fa;
  }

  &.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
    background-color: #f0f7ff;
    border-radius: 8px 8px 0 0;
    font-weight: bold;
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

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #495057;
  padding: 1rem 2rem;
  font-size: 1.25rem;
  cursor: pointer;
  
  &:hover {
    color: #dc3545;
  }
`;

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    대분류: '',
    중분류: '',
    소분류: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    
    // 디버깅 위한 로그
    console.log('Input Change:', {
      section,
      name,
      value,
      currentFormData: formData
    });

    setFormData(prev => {
      const newData = {
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      };
      console.log('Updated FormData:', newData);
      return newData;
    });
  };

  const handleSubmit = async () => {
    try {
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

      console.log('저장 시도:', saveData);

      const response = await healthInfoService.create(saveData);
      console.log('API 응답:', response);

      if (response) {
        alert('건강정보가 성공적으로 저장되었습니다.');
        
        setFormData({...initialFormData});
        setSelectedSymptoms([]);
        setSelectedCategory({
          대분류: '',
          중분류: '',
          소분류: ''
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

    } catch (error) {
      console.error('저장 실패:', error);
      alert(`저장에 실패했습니다: ${error.message}`);
    }
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

  const handleSearch = async (searchParams) => {
    setIsLoading(true);
    try {
      const results = await searchData(searchParams);
      setSearchResults(results);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <AppContainer>
      {isAuthenticated && (
        <NavBar>
          <StyledNavLink to="/">홈</StyledNavLink>
          <StyledNavLink to="/list">목록보기</StyledNavLink>
          <StyledNavLink to="/new">새 건강정보 입력</StyledNavLink>
          <StyledNavLink to="/profile">프로필</StyledNavLink>
          <StyledNavLink to="/about">About</StyledNavLink>
          <StyledNavLink to="/test">API 테스트</StyledNavLink>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </NavBar>
      )}
      
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? 
            <Navigate to="/" replace /> : 
            <Login />
        } />
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
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
              validationErrors={validationErrors}
              isValid={isValid}
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
  );
}

export default App;