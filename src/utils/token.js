const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const tokenService = {
  // 토큰 저장
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // 토큰 가져오기
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // 토큰 삭제
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // 사용자 정보 저장
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // 사용자 정보 가져오기
  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // 사용자 정보 삭제
  removeUser() {
    localStorage.removeItem(USER_KEY);
  },

  // 모든 인증 정보 초기화
  clearAll() {
    this.removeToken();
    this.removeUser();
  },

  // 토큰 존재 여부 확인
  isAuthenticated() {
    return !!this.getToken();
  }
};

export default tokenService;