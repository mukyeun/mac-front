import React from 'react';
import {
  Drawer as MuiDrawer,
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const Drawer = ({
  open,
  onClose,
  title,
  children,
  anchor = 'right',
  width = 400,
  footer,
  hideCloseButton = false,
  disableBackdropClick = false,
  elevation = 1,
  headerProps = {},
  contentProps = {},
  footerProps = {},
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleBackdropClick = (event) => {
    if (!disableBackdropClick) {
      onClose?.(event, 'backdropClick');
    }
  };

  return (
    <MuiDrawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      onClick={handleBackdropClick}
      elevation={elevation}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : width,
          maxWidth: '100%'
        }
      }}
      {...props}
    >
      {/* Header */}
      {(title || !hideCloseButton) && (
        <>
          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              minHeight: 64,
              ...headerProps.sx
            }}
            {...headerProps}
          >
            {title && (
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
              >
                {title}
              </Typography>
            )}
            {!hideCloseButton && (
              <IconButton
                edge="end"
                onClick={onClose}
                aria-label="close"
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary'
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <Divider />
        </>
      )}

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 3,
          ...contentProps.sx
        }}
        {...contentProps}
      >
        {children}
      </Box>

      {/* Footer */}
      {footer && (
        <>
          <Divider />
          <Box
            sx={{
              p: 3,
              backgroundColor: 'background.default',
              ...footerProps.sx
            }}
            {...footerProps}
          >
            {footer}
          </Box>
        </>
      )}
    </MuiDrawer>
  );
};

export default Drawer;