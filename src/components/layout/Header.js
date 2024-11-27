import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 'bold'
          }}
        >
          건강관리 시스템
        </Typography>
        
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={RouterLink}
              to="/list"
              color="inherit"
              sx={{ color: 'text.primary' }}
            >
              목록보기
            </Button>
            <Button
              component={RouterLink}
              to="/new"
              color="inherit"
              sx={{ color: 'text.primary' }}
            >
              새 건강정보
            </Button>
            <Button
              component={RouterLink}
              to="/profile"
              color="inherit"
              sx={{ color: 'text.primary' }}
            >
              프로필
            </Button>
            <Button
              onClick={logout}
              color="inherit"
              sx={{ color: 'error.main' }}
            >
              로그아웃
            </Button>
          </Box>
        ) : (
          <Button
            component={RouterLink}
            to="/login"
            color="primary"
            variant="contained"
          >
            로그인
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;