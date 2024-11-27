import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  HealthAndSafety,
  Analytics,
  Security,
  Support
} from '@mui/icons-material';

const About = () => {
  return (
    <Container>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          건강관리 시스템 소개
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          사용자 중심의 건강관리 솔루션을 제공합니다.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                주요 기능
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <HealthAndSafety color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="건강 정보 관리" 
                    secondary="개인 건강 정보를 체계적으로 기록하고 관리합니다."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Analytics color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="데이터 분석" 
                    secondary="건강 데이터를 분석하여 맞춤형 인사이트를 제공합니다."
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                시스템 특징
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Security color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="보안" 
                    secondary="철저한 보안 시스템으로 개인정보를 안전하게 보호합니다."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Support color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="고객 지원" 
                    secondary="24시간 고객 지원으로 불편함 없는 서비스를 제공합니다."
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="body1" color="text.secondary" align="center">
          더 나은 건강관리를 위한 파트너가 되어드리겠습니다.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;