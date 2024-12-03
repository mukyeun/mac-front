// 우선순위별 테스트 계획
const testPriority = {
  high: [
    'AuthContext.test.js',      // 인증 관련 테스트
    'HealthInfoForm.test.js',   // 건강정보 입력 폼
    'HealthDashboard.test.js',  // 대시보드 
    'DataTable.test.js'         // 데이터 테이블
  ],
  medium: [
    'visualization/*.test.js',   // 차트 컴포넌트들
    'common/*.test.js',         // 공통 컴포넌트
    'hooks/*.test.js'           // 커스텀 훅
  ],
  low: [
    'utils/*.test.js',          // 유틸리티 함수
    'services/*.test.js'        // API 서비스
  ]
}
