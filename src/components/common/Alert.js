import React from 'react';
import {
  Alert as MuiAlert,
  AlertTitle,
  IconButton,
  Collapse,
  Box,
  Link
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
  WarningAmber as WarningIcon
} from '@mui/icons-material';

const Alert = ({
  severity = 'info',
  variant = 'standard',
  title,
  message,
  action,
  link,
  linkText = '자세히 보기',
  onClose,
  icon,
  closeText = '닫기',
  collapsible = false,
  defaultExpanded = true,
  sx = {}
}) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  // 아이콘 매핑
  const icons = {
    success: SuccessIcon,
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon
  };

  const AlertIcon = icon || icons[severity];

  // 닫기 버튼
  const closeButton = onClose && (
    <IconButton
      aria-label={closeText}
      color="inherit"
      size="small"
      onClick={onClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  // 링크 처리
  const linkElement = link && (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      color="inherit"
      sx={{
        display: 'block',
        fontSize: '0.875rem',
        textDecoration: 'underline',
        mt: 1,
        '&:hover': {
          textDecoration: 'none'
        }
      }}
    >
      {linkText}
    </Link>
  );

  const alertContent = (
    <MuiAlert
      severity={severity}
      variant={variant}
      icon={<AlertIcon />}
      action={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {action}
          {closeButton}
        </Box>
      }
      sx={{
        '& .MuiAlert-message': {
          width: '100%'
        },
        ...sx
      }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
      {linkElement}
    </MuiAlert>
  );

  if (collapsible) {
    return (
      <Collapse in={expanded}>
        {alertContent}
      </Collapse>
    );
  }

  return alertContent;
};

export default Alert;