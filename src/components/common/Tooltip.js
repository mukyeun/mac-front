import React from 'react';
import {
  Tooltip as MuiTooltip,
  IconButton,
  Typography,
  Box,
  Link,
  useTheme
} from '@mui/material';
import {
  Info as InfoIcon,
  Help as HelpIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const Tooltip = ({
  title,
  description,
  link,
  linkText = '자세히 보기',
  type = 'info',
  icon: CustomIcon,
  iconProps = {},
  iconButtonProps = {},
  placement = 'top',
  maxWidth = 300,
  children,
  ...props
}) => {
  const theme = useTheme();

  // 아이콘 및 색상 설정
  const icons = {
    info: { icon: InfoIcon, color: theme.palette.info.main },
    help: { icon: HelpIcon, color: theme.palette.info.main },
    error: { icon: ErrorIcon, color: theme.palette.error.main },
    warning: { icon: WarningIcon, color: theme.palette.warning.main }
  };

  const { icon: Icon, color } = icons[type] || icons.info;
  const TooltipIcon = CustomIcon || Icon;

  // 툴팁 내용 구성
  const tooltipContent = (
    <Box sx={{ maxWidth }}>
      {title && (
        <Typography 
          variant="subtitle2" 
          component="div"
          sx={{ 
            fontWeight: 600,
            mb: description ? 0.5 : 0
          }}
        >
          {title}
        </Typography>
      )}
      {description && (
        <Typography 
          variant="body2" 
          component="div"
          sx={{ 
            mb: link ? 1 : 0,
            color: 'inherit'
          }}
        >
          {description}
        </Typography>
      )}
      {link && (
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          sx={{
            display: 'block',
            fontSize: '0.75rem',
            textDecoration: 'underline',
            '&:hover': {
              textDecoration: 'none'
            }
          }}
        >
          {linkText}
        </Link>
      )}
    </Box>
  );

  // 아이콘만 있는 경우의 렌더링
  if (!children) {
    return (
      <MuiTooltip 
        title={tooltipContent}
        placement={placement}
        {...props}
      >
        <IconButton
          size="small"
          sx={{ color }}
          {...iconButtonProps}
        >
          <TooltipIcon 
            fontSize="small"
            {...iconProps}
          />
        </IconButton>
      </MuiTooltip>
    );
  }

  // children이 있는 경우의 렌더링
  return (
    <MuiTooltip 
      title={tooltipContent}
      placement={placement}
      {...props}
    >
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;