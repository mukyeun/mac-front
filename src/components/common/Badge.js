import React from 'react';
import {
  Box,
  Typography,
  Tooltip,
  useTheme
} from '@mui/material';

const Badge = ({
  label,
  color = 'default',
  variant = 'contained',
  size = 'medium',
  icon: Icon,
  tooltip,
  onClick,
  disabled = false,
  sx = {}
}) => {
  const theme = useTheme();

  // 색상 설정
  const colors = {
    default: {
      light: theme.palette.grey[200],
      main: theme.palette.grey[500],
      dark: theme.palette.grey[700],
      contrastText: theme.palette.common.white
    },
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    error: theme.palette.error,
    warning: theme.palette.warning,
    info: theme.palette.info,
    success: theme.palette.success
  };

  const currentColor = colors[color] || colors.default;

  // 크기 설정
  const sizes = {
    small: {
      height: 20,
      fontSize: '0.75rem',
      iconSize: 14,
      paddingX: 1
    },
    medium: {
      height: 24,
      fontSize: '0.875rem',
      iconSize: 16,
      paddingX: 1.5
    },
    large: {
      height: 32,
      fontSize: '1rem',
      iconSize: 20,
      paddingX: 2
    }
  };

  const currentSize = sizes[size] || sizes.medium;

  // 변형에 따른 스타일 설정
  const variants = {
    contained: {
      backgroundColor: disabled ? theme.palette.action.disabledBackground : currentColor.main,
      color: disabled ? theme.palette.action.disabled : currentColor.contrastText,
      '&:hover': !disabled && onClick ? {
        backgroundColor: currentColor.dark,
        cursor: 'pointer'
      } : {}
    },
    outlined: {
      backgroundColor: 'transparent',
      border: `1px solid ${disabled ? theme.palette.action.disabled : currentColor.main}`,
      color: disabled ? theme.palette.action.disabled : currentColor.main,
      '&:hover': !disabled && onClick ? {
        backgroundColor: currentColor.light,
        cursor: 'pointer'
      } : {}
    },
    soft: {
      backgroundColor: disabled ? theme.palette.action.disabledBackground : currentColor.light,
      color: disabled ? theme.palette.action.disabled : currentColor.main,
      '&:hover': !disabled && onClick ? {
        backgroundColor: theme.palette.action.hover,
        cursor: 'pointer'
      } : {}
    }
  };

  const currentVariant = variants[variant] || variants.contained;

  const badge = (
    <Box
      onClick={!disabled && onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        height: currentSize.height,
        padding: `0 ${currentSize.paddingX}px`,
        borderRadius: '100px',
        ...currentVariant,
        ...sx
      }}
    >
      {Icon && (
        <Icon 
          sx={{ 
            fontSize: currentSize.iconSize,
            mr: label ? 0.5 : 0
          }} 
        />
      )}
      {label && (
        <Typography
          variant="caption"
          sx={{
            fontSize: currentSize.fontSize,
            lineHeight: 1,
            fontWeight: 500
          }}
        >
          {label}
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

export default Badge;