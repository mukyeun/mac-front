import React, { useState } from 'react';
import axios from 'axios';
import HealthInfoTest from './HealthInfoTest';

const APITest = () => {
  const [result, setResult] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const testRegister = async () => {
    const timestamp = new Date().getTime() % 10000;
    const testUserData = {
      username: `test${timestamp}`,
      email: `test${timestamp}@naver.com`,
      password: "Test1234!@#",
      name: "테스트유저"
    };
    
    try {
      console.log('Sending registration request with data:', testUserData);
      
      const response = await axios({
        method: 'post',
        url: 'http://localhost:5000/api/users/register',
        data: testUserData,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Registration successful:', response.data);
      
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        setToken(response.data.data.token);
        setIsLoggedIn(true);
        localStorage.setItem('testEmail', testUserData.email);
        localStorage.setItem('testPassword', testUserData.password);
      }
      
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      setResult(
        `Registration failed\n\n` +
        `Status: ${error.response?.status}\n` +
        `Message: ${error.response?.data?.message || error.message}\n\n` +
        `Details:\n${JSON.stringify(error.response?.data, null, 2)}`
      );
    }
  };

  const testLogin = async () => {
    const loginData = {
      email: localStorage.getItem('testEmail'),
      password: localStorage.getItem('testPassword')
    };
    
    try {
      console.log('Sending login request with data:', loginData);
      
      const response = await axios({
        method: 'post',
        url: 'http://localhost:5000/api/users/login',
        data: loginData,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Login successful:', response.data);
      
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        setToken(response.data.data.token);
        setIsLoggedIn(true);
      }
      
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Login error:', error.response?.data);
      setResult(
        `Login failed\n\n` +
        `Status: ${error.response?.status}\n` +
        `Message: ${error.response?.data?.message || error.message}\n\n` +
        `Details:\n${JSON.stringify(error.response?.data, null, 2)}`
      );
    }
  };

  const testLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
    setResult('로그아웃 되었습니다.');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2>인증 API 테스트</h2>
        <div style={{ marginBottom: '20px' }}>
          <strong>현재 상태:</strong> {isLoggedIn ? '로그인됨' : '로그아웃됨'}
        </div>
        
        <div style={{ marginBottom: '20px', gap: '10px', display: 'flex' }}>
          <button 
            onClick={testRegister}
            style={{ padding: '8px 16px' }}
          >
            회원가입 테스트
          </button>
          
          <button 
            onClick={testLogin}
            style={{ padding: '8px 16px' }}
            disabled={isLoggedIn}
          >
            로그인 테스트
          </button>
          
          <button 
            onClick={testLogout}
            style={{ padding: '8px 16px' }}
            disabled={!isLoggedIn}
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
            wordBreak: 'break-word'
          }}>
            {result}
          </pre>
        </div>
      </div>

      <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <HealthInfoTest />
      </div>
    </div>
  );
};

export default APITest;
