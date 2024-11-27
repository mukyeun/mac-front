import React from 'react';
import { Alert, Box, Button, Collapse, Typography } from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const ErrorMessage = ({ 
  error, 
  onRetry, 
  severity = 'error',
  message,
  details,
  showContactInfo = true
}) => {
  const errorMessage = message || error?.message || '오류가 발생했습니다.';
  const errorDetails = details || error?.details;

  const icons = {
    error: <ErrorIcon />,
    warning: <WarningIcon />,
    info: <InfoIcon />
  };

  return (
    <Box sx={{ my: 2 }}>
      <Alert 
        severity={severity}
        icon={icons[severity]}
        action={
          onRetry && (
            <Button 
              color="inherit" 
              size="small" 
              onClick={onRetry}
              startIcon={<RefreshIcon />}
              sx={{ 
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              다시 시도
            </Button>
          )
        }
        sx={{
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Typography variant="body1" component="div">
          {errorMessage}
        </Typography>
        <Collapse in={!!errorDetails}>
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 1, 
              color: 'text.secondary',
              whiteSpace: 'pre-wrap'
            }}
          >
            {errorDetails}
          </Typography>
        </Collapse>
      </Alert>
      
      <Collapse in={severity === 'warning' && showContactInfo}>
        <Alert 
          severity="info" 
          icon={<InfoIcon />}
          sx={{ mt: 1 }}
        >
          문제가 지속되면 관리자에게 문의해주세요.
        </Alert>
      </Collapse>
    </Box>
  );
};

export default ErrorMessage;