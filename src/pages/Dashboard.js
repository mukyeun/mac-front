import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '40px auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{
          color: '#333',
          margin: 0
        }}>
          대시보드
        </h2>
        <div>
          <Link
            to="/profile"
            style={{
              padding: '8px 16px',
              backgroundColor: '#fff',
              color: '#4285f4',
              border: '1px solid #4285f4',
              borderRadius: '4px',
              textDecoration: 'none',
              marginRight: '10px',
              fontSize: '14px'
            }}
          >
            프로필 설정
          </Link>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{
          marginTop: 0,
          marginBottom: '15px',
          color: '#444',
          fontSize: '18px'
        }}>
          환영합니다, {user?.name || '사용자'}님!
        </h3>
        
        <p style={{
          color: '#666',
          lineHeight: '1.6',
          fontSize: '14px',
          margin: 0
        }}>
          이곳에서 다양한 기능을 사용하실 수 있습니다.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {/* 추가 대시보드 카드들을 여기에 배치할 수 있습니다 */}
        <DashboardCard 
          title="통계"
          description="시스템 사용 통계를 확인하세요."
        />
        <DashboardCard 
          title="설정"
          description="시스템 설정을 관리하세요."
        />
        <DashboardCard 
          title="도움말"
          description="시스템 사용 가이드를 확인하세요."
        />
      </div>
    </div>
  );
};

// 대시보드 카드 컴포넌트
const DashboardCard = ({ title, description }) => (
  <div style={{
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    <h4 style={{
      margin: '0 0 10px 0',
      color: '#444',
      fontSize: '16px'
    }}>
      {title}
    </h4>
    <p style={{
      color: '#666',
      fontSize: '14px',
      margin: 0,
      lineHeight: '1.5'
    }}>
      {description}
    </p>
  </div>
);

export default Dashboard;