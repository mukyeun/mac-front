import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import {
  InboxOutlined,
  SearchOff,
  ErrorOutline,
  CloudOff,
  BlockOutlined
} from '@mui/icons-material';

const EmptyState = ({
  type = 'default',
  title,
  description,
  icon: CustomIcon,
  action,
  actionText,
  onAction,
  image,
  imageAlt,
  minHeight = 400,
  maxWidth = 400,
  variant = 'default',
  sx = {}
}) => {
  const theme = useTheme();

  // 미리 정의된 타입별 설정
  const types = {
    default: {
      icon: InboxOutlined,
      title: '데이터가 없습니다',
      description: '아직 등록된 데이터가 없습니다.'
    },
    search: {
      icon: SearchOff,
      title: '검색 결과가 없습니다',
      description: '다른 검색어로 다시 시도해보세요.'
    },
    error: {
      icon: ErrorOutline,
      title: '오류가 발생했습니다',
      description: '잠시 후 다시 시도해주세요.'
    },
    offline: {
      icon: CloudOff,
      title: '오프라인 상태입니다',
      description: '인터넷 연결을 확인해주세요.'
    },
    noAccess: {
      icon: BlockOutlined,
      title: '접근 권한이 없습니다',
      description: '필요한 권한을 요청하세요.'
    }
  };

  // 현재 타입의 설정 가져오기
  const currentType = types[type] || types.default;
  const Icon = CustomIcon || currentType.icon;

  // 변형별 스타일
  const variants = {
    default: {
      wrapper: {},
      icon: {
        fontSize: 48,
        color: theme.palette.action.active
      }
    },
    compact: {
      wrapper: {
        minHeight: minHeight / 2
      },
      icon: {
        fontSize: 40,
        color: theme.palette.action.active
      }
    },
    colored: {
      wrapper: {},
      icon: {
        fontSize: 48,
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        padding: 2,
        borderRadius: '50%'
      }
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight,
        maxWidth,
        margin: '0 auto',
        padding: 3,
        ...currentVariant.wrapper,
        ...sx
      }}
    >
      {image ? (
        <Box
          component="img"
          src={image}
          alt={imageAlt || title}
          sx={{
            maxWidth: '100%',
            height: 'auto',
            mb: 3
          }}
        />
      ) : (
        <Icon
          sx={{
            mb: 3,
            ...currentVariant.icon
          }}
        />
      )}

      <Typography
        variant="h6"
        component="h2"
        gutterBottom
      >
        {title || currentType.title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: action ? 3 : 0 }}
      >
        {description || currentType.description}
      </Typography>

      {action && (
        <Button
          variant="contained"
          onClick={onAction}
          sx={{ mt: 2 }}
        >
          {actionText || '확인'}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;