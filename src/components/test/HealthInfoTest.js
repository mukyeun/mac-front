import React, { useState } from 'react';
import { 
  getHealthInfoList, 
  createHealthInfo, 
  updateHealthInfo, 
  deleteHealthInfo 
} from '../../api/healthInfo';

const HealthInfoTest = () => {
  const [result, setResult] = useState('');
  const [healthInfoList, setHealthInfoList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const token = localStorage.getItem('token');

  const testGetHealthInfo = async () => {
    try {
      const response = await getHealthInfoList();
      console.log('건강정보 목록:', response);
      setHealthInfoList(response.data || []);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('건강정보 목록 조회 실패:', error);
      setHealthInfoList([]);
      setResult(
        `건강정보 목록 조회 실패\n\n` +
        `Status: ${error.response?.status}\n` +
        `Message: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const testCreateHealthInfo = async () => {
    const healthData = {
      height: 175,
      weight: 70,
      bloodType: 'A',
      bloodPressure: {
        systolic: 120,
        diastolic: 80
      },
      bloodSugar: 95,
      medication: ['비타민C', '종합비타민'],
      healthNotes: '특이사항 없음'
    };

    try {
      const response = await createHealthInfo(healthData);
      console.log('건강정보 생성:', response);
      setResult(JSON.stringify(response, null, 2));
      // 생성 후 목록 새로고침
      testGetHealthInfo();
    } catch (error) {
      console.error('건강정보 생성 실패:', error);
      setResult(
        `건강정보 생성 실패\n\n` +
        `Status: ${error.response?.status}\n` +
        `Message: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const testUpdateHealthInfo = async () => {
    if (!selectedId) {
      setResult('수정할 건강정보를 선택해주세요.');
      return;
    }

    const updateData = {
      height: 176,
      weight: 71,
      bloodType: 'A',
      bloodPressure: {
        systolic: 118,
        diastolic: 78
      },
      bloodSugar: 92,
      medication: ['비타민C', '종합비타민', '오메가3'],
      healthNotes: '운동 시작'
    };

    try {
      const response = await updateHealthInfo(selectedId, updateData);
      console.log('건강정보 수정:', response);
      setResult(JSON.stringify(response, null, 2));
      // 수정 후 목록 새로고침
      testGetHealthInfo();
    } catch (error) {
      console.error('건강정보 수정 실패:', error);
      setResult(
        `건강정보 수정 실패\n\n` +
        `Status: ${error.response?.status}\n` +
        `Message: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const testDeleteHealthInfo = async () => {
    if (!selectedId) {
      setResult('삭제할 건강정보를 선택해주세요.');
      return;
    }

    try {
      const response = await deleteHealthInfo(selectedId);
      console.log('건강정보 삭제:', response);
      setResult(JSON.stringify(response, null, 2));
      setSelectedId(null);
      // 삭제 후 목록 새로고침
      testGetHealthInfo();
    } catch (error) {
      console.error('건강정보 삭제 실패:', error);
      setResult(
        `건강정보 삭제 실패\n\n` +
        `Status: ${error.response?.status}\n` +
        `Message: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const renderHealthInfoList = () => {
    if (!healthInfoList.length) {
      return <p>건강정보가 없습니다.</p>;
    }

    return (
      <div style={{ marginBottom: '20px' }}>
        <h3>건강정보 목록</h3>
        <div style={{ 
          display: 'grid', 
          gap: '10px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {healthInfoList.map((info) => (
            <div 
              key={info._id}
              style={{
                padding: '10px',
                border: `1px solid ${selectedId === info._id ? '#007bff' : '#ddd'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: selectedId === info._id ? '#f8f9fa' : 'white'
              }}
              onClick={() => setSelectedId(info._id)}
            >
              <div><strong>키:</strong> {info.height}cm</div>
              <div><strong>체중:</strong> {info.weight}kg</div>
              <div><strong>혈액형:</strong> {info.bloodType}형</div>
              <div>
                <strong>혈압:</strong> 
                {info.bloodPressure.systolic}/{info.bloodPressure.diastolic} mmHg
              </div>
              <div><strong>혈당:</strong> {info.bloodSugar} mg/dL</div>
              <div><strong>복용약물:</strong> {info.medication.join(', ')}</div>
              <div><strong>특이사항:</strong> {info.healthNotes}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>건강정보 API 테스트</h2>
      
      {/* 로그인 상태 표시 */}
      <div style={{ marginBottom: '20px' }}>
        <strong>현재 상태:</strong> {token ? '로그인됨' : '로그아웃됨'}
        {selectedId && <span> | 선택된 ID: {selectedId}</span>}
      </div>
      
      {/* 버튼 그룹 */}
      <div style={{ marginBottom: '20px', gap: '10px', display: 'flex', flexWrap: 'wrap' }}>
        <button 
          onClick={testGetHealthInfo}
          style={{ padding: '8px 16px' }}
          disabled={!token}
        >
          목록 조회
        </button>
        
        <button 
          onClick={testCreateHealthInfo}
          style={{ padding: '8px 16px' }}
          disabled={!token}
        >
          정보 생성
        </button>

        <button 
          onClick={testUpdateHealthInfo}
          style={{ padding: '8px 16px' }}
          disabled={!token || !selectedId}
        >
          정보 수정
        </button>

        <button 
          onClick={testDeleteHealthInfo}
          style={{ padding: '8px 16px' }}
          disabled={!token || !selectedId}
        >
          정보 삭제
        </button>
      </div>
      
      {/* 건강정보 목록 표시 */}
      {renderHealthInfoList()}
      
      {/* API 결과 표시 */}
      <div>
        <h3>API 응답 결과</h3>
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
  );
};

export default HealthInfoTest;
