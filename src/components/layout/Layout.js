import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Brightness4, Brightness7, Menu as MenuIcon } from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const StyledAppBar = styled(AppBar)`
  background-color: ${({ theme }) => theme.palette.primary.main};
`;

const UserInfo = styled(Typography)`
  margin-right: 1rem;
`;

const Layout = ({ children }) => {
  const { mode, toggleMode } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <StyledLayout>
      <StyledAppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {/* 사이드 메뉴 토글 로직 */}}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            건강관리 시스템
          </Typography>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <UserInfo variant="subtitle1">
                {user.name} 님
              </UserInfo>
              
              <IconButton 
                color="inherit" 
                onClick={toggleMode}
                sx={{ mr: 2 }}
              >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>

              <IconButton
                color="inherit"
                onClick={handleLogout}
              >
                로그아웃
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>

      <MainContent>
        {children}
      </MainContent>

      <footer>
        {/* 푸터 내용 */}
      </footer>
    </StyledLayout>
  );
};

export default Layout;