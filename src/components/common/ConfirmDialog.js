import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  severity = 'warning',
  maxWidth = 'xs',
  loading = false,
  hideCancel = false
}) => {
  const colors = {
    warning: 'warning.main',
    error: 'error.main',
    info: 'info.main',
    success: 'success.main'
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth={maxWidth}
      fullWidth
      aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle id="confirm-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="h6" 
            component="span"
            sx={{ color: colors[severity], flexGrow: 1 }}
          >
            {title}
          </Typography>
          <IconButton
            size="small"
            onClick={onCancel}
            disabled={loading}
            aria-label="닫기"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!hideCancel && (
          <Button
            onClick={onCancel}
            disabled={loading}
            color="inherit"
          >
            {cancelText}
          </Button>
        )}
        <Button
          onClick={onConfirm}
          disabled={loading}
          color={severity}
          variant="contained"
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;