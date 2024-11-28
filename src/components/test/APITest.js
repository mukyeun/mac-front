import React, { useState } from 'react';
import { authService } from '../../services/authService';
import HealthInfoTest from './HealthInfoTest';

const APITest = () => {
  const [result, setResult] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (error, action) => {
    console.error(`${action} error:`, error);
    setError(error.message || `${action}에 실패했습니다.`);
    setResult(
      `${action} failed\n\n` +
      `Message: ${error.message}\n\n` +
      `Details:\n${JSON.stringify(error.response?.data || {}, null, 2)}`
    );
  };

  const clearError = () => {
    setError(null);
  };

  const testRegister = async () => {
    clearError();
    setLoading(true);
    const timestamp = new Date().getTime() % 10000;
    const testUserData = {
      username: `test${timestamp}`,
      email: `test${timestamp}@naver.com`,
      password: "Test1234!@",
      name: "테스트유저"
    };
    
    try {
      console.log('Sending registration request with data:', testUserData);
      const response = await authService.register(testUserData);
      console.log('Registration successful:', response);
      
      if (response.token) {
        setToken(response.token);
        setIsLoggedIn(true);
        localStorage.setItem('testEmail', testUserData.email);
        localStorage.setItem('testPassword', testUserData.password);
        setResult(JSON.stringify(response, null, 2));
      }
    } catch (error) {
      handleError(error, '회원가입');
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    clearError();
    setLoading(true);
    const loginData = {
      email: localStorage.getItem('testEmail'),
      password: localStorage.getItem('testPassword')
    };
    
    try {
      console.log('Sending login request with data:', loginData);
      const response = await authService.login(loginData);
      console.log('Login successful:', response);
      
      if (response.token) {
        setToken(response.token);
        setIsLoggedIn(true);
        setResult(JSON.stringify(response, null, 2));
      }
    } catch (error) {
      handleError(error, '로그인');
    } finally {
      setLoading(false);
    }
  };

  const testLogout = async () => {
    clearError();
    setLoading(true);
    try {
      await authService.logout();
      setToken(null);
      setIsLoggedIn(false);
      setResult('로그아웃 되었습니다.');
    } catch (error) {
      handleError(error, '로그아웃');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2>인증 API 테스트</h2>
        
        {error && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '20px', 
            backgroundColor: '#ffebee', 
            color: '#c62828',
            borderRadius: '4px',
            border: '1px solid #ef9a9a'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <strong>현재 상태:</strong> {isLoggedIn ? '로그인됨' : '로그아웃됨'}
          {loading && <span style={{ marginLeft: '10px', color: '#666' }}>(처리 중...)</span>}
        </div>
        
        <div style={{ 
          marginBottom: '20px', 
          gap: '10px', 
          display: 'flex' 
        }}>
          <button 
            onClick={testRegister}
            disabled={loading}
            style={{ 
              padding: '8px 16px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            회원가입 테스트
          </button>
          
          <button 
            onClick={testLogin}
            disabled={loading || isLoggedIn}
            style={{ 
              padding: '8px 16px',
              opacity: (loading || isLoggedIn) ? 0.7 : 1,
              cursor: (loading || isLoggedIn) ? 'not-allowed' : 'pointer'
            }}
          >
            로그인 테스트
          </button>
          
          <button 
            onClick={testLogout}
            disabled={loading || !isLoggedIn}
            style={{ 
              padding: '8px 16px',
              opacity: (loading || !isLoggedIn) ? 0.7 : 1,
              cursor: (loading || !isLoggedIn) ? 'not-allowed' : 'pointer'
            }}
          >
            로그아웃 테스트
          </button>
        </div>
        
        <div>
          <h3>결과</h3>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '5px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            border: '1px solid #ddd'
          }}>
            {result}
          </pre>
        </div>
      </div>

      <div style={{ 
        marginTop: '40px', 
        borderTop: '1px solid #eee', 
        paddingTop: '20px' 
      }}>
        <HealthInfoTest />
      </div>
    </div>
  );
};

export default APITest;