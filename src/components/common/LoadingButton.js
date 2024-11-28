import React from 'react';
import {
  Button,
  CircularProgress,
  Box,
  useTheme
} from '@mui/material';

const LoadingButton = ({
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  loadingPosition = 'center',
  loadingIndicator,
  loadingSize = 20,
  children,
  sx,
  ...props
}) => {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  // 로딩 인디케이터 생성
  const getLoadingIndicator = () => {
    if (loadingIndicator) return loadingIndicator;
    
    return (
      <CircularProgress
        size={loadingSize}
        sx={{
          color: props.variant === 'contained' 
            ? 'inherit'
            : theme.palette[props.color || 'primary'].main
        }}
      />
    );
  };

  // 로딩 위치에 따른 컨텐츠 구성
  const content = () => {
    if (!loading) {
      return (
        <>
          {startIcon}
          {children}
          {endIcon}
        </>
      );
    }

    switch (loadingPosition) {
      case 'start':
        return (
          <>
            <Box 
              component="span" 
              sx={{ 
                display: 'inherit',
                mr: 1,
                '& > *': { ml: -1 }
              }}
            >
              {getLoadingIndicator()}
            </Box>
            {children}
            {endIcon}
          </>
        );
      case 'end':
        return (
          <>
            {startIcon}
            {children}
            <Box 
              component="span" 
              sx={{ 
                display: 'inherit',
                ml: 1,
                '& > *': { mr: -1 }
              }}
            >
              {getLoadingIndicator()}
            </Box>
          </>
        );
      default: // center
        return getLoadingIndicator();
    }
  };

  return (
    <Button
      disabled={isDisabled}
      sx={{
        position: 'relative',
        '&.Mui-disabled': {
          backgroundColor: loading ? '' : 'action.disabledBackground'
        },
        ...sx
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          visibility: loading && loadingPosition === 'center' ? 'hidden' : 'visible'
        }}
      >
        {content()}
      </Box>
    </Button>
  );
};

export default LoadingButton;