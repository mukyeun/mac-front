import React from 'react';
import { 
  Box, 
  Button, 
  IconButton, 
  Tooltip 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const ActionButtons = ({ 
  onEdit, 
  onDelete,
  showLabels = true,
  size = 'small',
  tooltipPlacement = 'top',
  disabled = false
}) => {
  const buttons = showLabels ? (
    <>
      <Button
        variant="contained"
        color="success"
        size={size}
        onClick={onEdit}
        startIcon={<EditIcon />}
        disabled={disabled}
        sx={{ minWidth: 'auto' }}
      >
        수정
      </Button>
      <Button
        variant="contained"
        color="error"
        size={size}
        onClick={onDelete}
        startIcon={<DeleteIcon />}
        disabled={disabled}
        sx={{ minWidth: 'auto' }}
      >
        삭제
      </Button>
    </>
  ) : (
    <>
      <Tooltip title="수정" placement={tooltipPlacement}>
        <IconButton
          color="success"
          size={size}
          onClick={onEdit}
          disabled={disabled}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="삭제" placement={tooltipPlacement}>
        <IconButton
          color="error"
          size={size}
          onClick={onDelete}
          disabled={disabled}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center'
      }}
    >
      {buttons}
    </Box>
  );
};

export default ActionButtons;