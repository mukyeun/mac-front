import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          건강정보 관리
        </Typography>
        <Button color="inherit" onClick={() => navigate('/login')}>로그인</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;