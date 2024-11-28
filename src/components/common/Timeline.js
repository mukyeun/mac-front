import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Skeleton,
  useTheme,
  alpha
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Cancel as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const Timeline = ({
  items = [],
  loading = false,
  loadingItems = 3,
  maxHeight,
  showTime = true,
  dense = false,
  alternating = false,
  lineColor,
  sx = {}
}) => {
  const theme = useTheme();

  // 타임라인 아이템 아이콘 설정
  const getIcon = (type) => {
    const icons = {
      success: {
        icon: SuccessIcon,
        color: theme.palette.success.main,
        bgColor: alpha(theme.palette.success.main, 0.1)
      },
      error: {
        icon: ErrorIcon,
        color: theme.palette.error.main,
        bgColor: alpha(theme.palette.error.main, 0.1)
      },
      warning: {
        icon: WarningIcon,
        color: theme.palette.warning.main,
        bgColor: alpha(theme.palette.warning.main, 0.1)
      },
      info: {
        icon: InfoIcon,
        color: theme.palette.info.main,
        bgColor: alpha(theme.palette.info.main, 0.1)
      }
    };

    const iconConfig = icons[type] || icons.info;
    const IconComponent = iconConfig.icon;

    return (
      <Avatar
        sx={{
          width: dense ? 32 : 40,
          height: dense ? 32 : 40,
          bgcolor: iconConfig.bgColor,
          color: iconConfig.color
        }}
      >
        <IconComponent fontSize={dense ? 'small' : 'medium'} />
      </Avatar>
    );
  };

  // 시간 포맷팅
  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 날짜 포맷팅
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 로딩 상태 렌더링
  const renderLoading = () => (
    <Box>
      {Array.from({ length: loadingItems }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            mb: 3,
            position: 'relative'
          }}
        >
          <Skeleton
            variant="circular"
            width={dense ? 32 : 40}
            height={dense ? 32 : 40}
          />
          <Box sx={{ ml: 2, flex: 1 }}>
            <Skeleton variant="text" width="20%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        </Box>
      ))}
    </Box>
  );

  if (loading) {
    return renderLoading();
  }

  return (
    <Box
      sx={{
        maxHeight,
        overflow: maxHeight ? 'auto' : 'visible',
        overflowY: maxHeight ? 'scroll' : 'visible',
        position: 'relative',
        '&::-webkit-scrollbar': {
          width: 6
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.action.hover
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.action.active,
          borderRadius: 3
        },
        ...sx
      }}
    >
      {items.map((item, index) => (
        <Box
          key={item.id || index}
          sx={{
            display: 'flex',
            flexDirection: alternating && index % 2 ? 'row-reverse' : 'row',
            mb: index === items.length - 1 ? 0 : 3,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: alternating ? '50%' : (dense ? 16 : 20),
              transform: alternating ? 'translateX(-50%)' : 'none',
              top: dense ? 32 : 40,
              bottom: index === items.length - 1 ? '50%' : -24,
              width: 2,
              backgroundColor: lineColor || theme.palette.divider
            }
          }}
        >
          <Box
            sx={{
              position: 'relative',
              zIndex: 1
            }}
          >
            {item.icon || getIcon(item.type)}
          </Box>

          <Box
            sx={{
              flex: 1,
              px: alternating ? 2 : 0,
              ml: alternating ? 0 : 2
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: dense ? 1.5 : 2,
                backgroundColor: theme.palette.background.default,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  mb: item.content ? 0.5 : 0
                }}
              >
                <Typography
                  variant={dense ? 'body2' : 'body1'}
                  sx={{ fontWeight: 500 }}
                >
                  {item.title}
                </Typography>
                {showTime && item.date && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 2 }}
                  >
                    {formatTime(item.date)}
                  </Typography>
                )}
              </Box>
              {item.content && (
                <Typography
                  variant={dense ? 'caption' : 'body2'}
                  color="text.secondary"
                >
                  {item.content}
                </Typography>
              )}
            </Paper>
            {item.date && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  textAlign: alternating && index % 2 ? 'right' : 'left'
                }}
              >
                {formatDate(item.date)}
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Timeline;