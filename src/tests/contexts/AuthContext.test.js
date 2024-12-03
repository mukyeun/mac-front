import { render, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '../../contexts/AuthContext';
import { createRoot } from 'react-dom/client';

describe('AuthContext', () => {
  const mockUser = {
    id: 1,
    username: 'testuser'
  };

  let container = null;
  let root = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    root.unmount();
    container.remove();
    container = null;
  });

  test('로그인 기능 테스트', async () => {
    let authHook;
    
    function TestComponent() {
      authHook = useAuth();
      return null;
    }

    await act(async () => {
      root.render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(authHook).toBeDefined();
    expect(authHook.login).toBeDefined();
  });

  // ... 나머지 테스트 케이스들
});