import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{
        marginBottom: '20px',
        color: '#333'
      }}>
        대시보드
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          marginBottom: '15px',
          color: '#444'
        }}>
          환영합니다, {user?.name || '사용자'}님!
        </h2>
        
        <p style={{
          color: '#666',
          lineHeight: '1.6'
        }}>
          이곳에서 다양한 기능을 사용하실 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;