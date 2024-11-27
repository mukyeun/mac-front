import React, { Component } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ErrorMessage from './ErrorMessage';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // 에러 로깅 서비스로 전송 (예: Sentry)
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            p: 3,
            textAlign: 'center'
          }}
        >
          <ErrorMessage
            error={this.state.error}
            details={this.state.errorInfo?.componentStack}
            message="죄송합니다. 예기치 않은 오류가 발생했습니다."
            onRetry={this.handleReset}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            문제가 지속되면 페이지를 새로고침하거나 나중에 다시 시도해주세요.
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            페이지 새로고침
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;