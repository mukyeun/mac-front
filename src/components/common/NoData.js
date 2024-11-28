import React from 'react';
import { Box, Typography } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';

const NoData = ({ 
  message = '데이터가 없습니다.',
  icon: Icon = InboxOutlined,
  height = 200 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: height,
        gap: 2
      }}
    >
      <Icon 
        sx={{ 
          fontSize: 48,
          color: 'text.secondary'
        }} 
      />
      <Typography 
        variant="body1" 
        color="text.secondary"
      >
        {message}
      </Typography>
    </Box>
  );
};

export default NoData;