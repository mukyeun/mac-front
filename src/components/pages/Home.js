import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  Container 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          안녕하세요, {user?.name || '게스트'}님!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          건강관리 시스템에 오신 것을 환영합니다.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                건강 정보 입력
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                새로운 건강 정보를 입력하고 관리하세요.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/new')}
              >
                새 정보 입력
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                건강 기록 조회
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                이전에 입력한 건강 기록을 확인하세요.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/list')}
              >
                기록 보기
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                프로필 관리
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                개인 정보와 설정을 관리하세요.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/profile')}
              >
                프로필 보기
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;