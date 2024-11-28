import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';

const StatusBadge = ({ 
  status, 
  showLabel = true,
  size = 'medium',
  tooltip
}) => {
  // 상태별 스타일 설정
  const statusStyles = {
    active: {
      backgroundColor: '#4CAF50',
      label: '활성',
      color: '#fff'
    },
    inactive: {
      backgroundColor: '#9E9E9E',
      label: '비활성',
      color: '#fff'
    },
    pending: {
      backgroundColor: '#FFC107',
      label: '대기',
      color: '#000'
    },
    error: {
      backgroundColor: '#F44336',
      label: '오류',
      color: '#fff'
    },
    warning: {
      backgroundColor: '#FF9800',
      label: '경고',
      color: '#000'
    },
    success: {
      backgroundColor: '#4CAF50',
      label: '완료',
      color: '#fff'
    }
  };

  const currentStyle = statusStyles[status] || statusStyles.inactive;
  
  // 크기별 스타일 설정
  const sizeStyles = {
    small: {
      height: 8,
      width: 8,
      fontSize: '0.75rem',
      padding: '0 6px'
    },
    medium: {
      height: 10,
      width: 10,
      fontSize: '0.875rem',
      padding: '0 8px'
    },
    large: {
      height: 12,
      width: 12,
      fontSize: '1rem',
      padding: '0 10px'
    }
  };

  const currentSize = sizeStyles[size];

  const badge = (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        borderRadius: 'pill',
        py: 0.5,
        px: showLabel ? 1.5 : 1,
        backgroundColor: currentStyle.backgroundColor,
        color: currentStyle.color
      }}
    >
      <Box
        sx={{
          width: currentSize.width,
          height: currentSize.height,
          borderRadius: '50%',
          backgroundColor: 'currentColor'
        }}
      />
      {showLabel && (
        <Typography
          variant="caption"
          sx={{
            fontSize: currentSize.fontSize,
            lineHeight: 1
          }}
        >
          {currentStyle.label}
        </Typography>
      )}
    </Box>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        {badge}
      </Tooltip>
    );
  }

  return badge;
};

export default StatusBadge;