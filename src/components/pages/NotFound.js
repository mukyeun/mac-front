import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '48px',
        marginBottom: '20px',
        color: '#333'
      }}>
        404
      </h1>
      <p style={{
        fontSize: '24px',
        marginBottom: '30px',
        color: '#666'
      }}>
        페이지를 찾을 수 없습니다
      </p>
      <Link 
        to="/"
        style={{
          padding: '10px 20px',
          backgroundColor: '#4285f4',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#3367d6'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#4285f4'}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
