import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

function LoadingSpinner({ 
  message = '로딩 중...', 
  size = 40,
  height = 200,
  color = 'primary'
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: height,
        gap: 2
      }}
    >
      <CircularProgress 
        size={size}
        color={color}
      />
      <Typography 
        variant="body1" 
        sx={{ 
          color: 'text.secondary',
          mt: 2 
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}

export default LoadingSpinner;