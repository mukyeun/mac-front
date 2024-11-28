import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const Modal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullScreen = false,
  hideCloseButton = false,
  disableBackdropClick = false,
  titleProps = {},
  contentProps = {},
  actionsProps = {},
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const autoFullScreen = isMobile && !fullScreen;

  const handleBackdropClick = (event) => {
    if (!disableBackdropClick) {
      onClose?.(event, 'backdropClick');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={fullScreen || autoFullScreen}
      onClick={handleBackdropClick}
      {...props}
    >
      {title && (
        <DialogTitle
          {...titleProps}
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            ...titleProps.sx
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            {title}
          </Typography>
          {!hideCloseButton && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent
        {...contentProps}
        sx={{
          px: 3,
          py: title ? 2 : 3,
          ...contentProps.sx
        }}
      >
        {children}
      </DialogContent>

      {actions && (
        <DialogActions
          {...actionsProps}
          sx={{
            px: 3,
            py: 2,
            ...actionsProps.sx
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;