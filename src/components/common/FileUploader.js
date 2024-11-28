import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  useTheme
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as RemoveIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon
} from '@mui/icons-material';

const FileUploader = ({
  accept,
  multiple = false,
  maxFiles = 5,
  maxSize = 5242880, // 5MB
  onUpload,
  onRemove,
  value = [],
  disabled = false,
  preview = false,
  dropzoneText = '파일을 드래그하거나 클릭하여 업로드',
  sx = {}
}) => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    // 파일 크기 검사
    if (file.size > maxSize) {
      return `파일 크기는 ${maxSize / 1024 / 1024}MB 이하여야 합니다.`;
    }
    
    // 파일 타입 검사
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      const fileExtension = `.${file.name.split('.').pop()}`;
      
      if (!acceptedTypes.some(type => 
        fileType.match(type.replace('*', '.*')) || 
        fileExtension.match(type.replace('*', '.*'))
      )) {
        return '지원하지 않는 파일 형식입니다.';
      }
    }

    return null;
  };
  const handleFiles = async (files) => {
    if (disabled) return;

    const fileList = Array.from(files);
    if (!multiple && fileList.length > 1) {
      setError('파일은 1개만 업로드할 수 있습니다.');
      return;
    }

    if (multiple && value.length + fileList.length > maxFiles) {
      setError(`최대 ${maxFiles}개까지 업로드할 수 있습니다.`);
      return;
    }

    // 파일 유효성 검사
    for (const file of fileList) {
      const error = validateFile(file);
      if (error) {
        setError(error);
        return;
      }
    }

    setError(null);
    setUploading(true);

    try {
      if (onUpload) {
        await onUpload(multiple ? fileList : fileList[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const { files } = e.dataTransfer;
    handleFiles(files);
  };

  const handleChange = (e) => {
    const { files } = e.target;
    handleFiles(files);
    // 같은 파일 재선택을 위해 value 초기화
    e.target.value = '';
  };

  const handleRemove = (file) => {
    if (onRemove) {
      onRemove(file);
    }
  };

  const renderPreview = (file) => {
    if (!preview) return null;

    if (file.type.startsWith('image/')) {
      return (
        <Box
          component="img"
          src={URL.createObjectURL(file)}
          alt={file.name}
          sx={{
            width: 40,
            height: 40,
            objectFit: 'cover',
            borderRadius: 1
          }}
        />
      );
    }

    return <FileIcon />;
  };

  return (
    <Box sx={sx}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      <Paper
        variant="outlined"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          p: 3,
          textAlign: 'center',
          cursor: disabled ? 'default' : 'pointer',
          backgroundColor: dragActive ? 'action.hover' : 'background.paper',
          borderStyle: dragActive ? 'dashed' : 'solid',
          borderColor: dragActive ? 'primary.main' : 'divider',
          '&:hover': {
            backgroundColor: disabled ? 'background.paper' : 'action.hover'
          }
        }}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <UploadIcon 
          sx={{ 
            fontSize: 40, 
            color: 'action.active',
            mb: 1
          }} 
        />
        <Typography variant="body1" gutterBottom>
          {dropzoneText}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {accept ? `지원 형식: ${accept}` : '모든 파일 지원'}
        </Typography>
      </Paper>

      {error && (
        <Typography 
          color="error" 
          variant="caption" 
          sx={{ mt: 1, display: 'block' }}
        >
          {error}
        </Typography>
      )}

      {uploading && (
        <LinearProgress sx={{ mt: 1 }} />
      )}

      {value.length > 0 && (
        <List sx={{ mt: 2 }}>
          {value.map((file, index) => (
            <ListItem key={index}>
              {preview && (
                <Box sx={{ mr: 2 }}>
                  {renderPreview(file)}
                </Box>
              )}
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1024).toFixed(1)} KB`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleRemove(file)}
                  disabled={disabled}
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileUploader;