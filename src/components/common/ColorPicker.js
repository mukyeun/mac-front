import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Button,
  IconButton,
  TextField,
  Popover,
  Typography,
  Tooltip,
  Slider,
  useTheme
} from '@mui/material';
import {
  Colorize as ColorizeIcon,
  Check as CheckIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { SketchPicker, ChromePicker } from 'react-color';

const ColorPicker = ({
  value = '#000000',
  onChange,
  variant = 'sketch',
  presetColors,
  disableAlpha = false,
  showInput = true,
  showCopy = true,
  showPreview = true,
  size = 'medium',
  disabled = false,
  error = false,
  helperText,
  label,
  placeholder = '#000000',
  sx = {}
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const anchorRef = useRef(null);

  // 색상 변경 처리
  const handleChange = (color) => {
    if (onChange) {
      if (disableAlpha) {
        onChange(color.hex);
      } else {
        const { r, g, b, a } = color.rgb;
        onChange(`rgba(${r}, ${g}, ${b}, ${a})`);
      }
    }
  };

  // 색상 복사 처리
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  // 색상 입력 처리
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  // 색상 유효성 검사
  const isValidColor = (color) => {
    const style = new Option().style;
    style.color = color;
    return style.color !== '';
  };

  // 색상 선택기 렌더링
  const renderColorPicker = () => {
    const commonProps = {
      color: value,
      onChange: handleChange,
      presetColors,
      disableAlpha
    };

    switch (variant) {
      case 'chrome':
        return <ChromePicker {...commonProps} />;
      case 'sketch':
      default:
        return <SketchPicker {...commonProps} />;
    }
  };

  return (
    <Box sx={sx}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        {showInput && (
          <TextField
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            error={error || !isValidColor(value)}
            helperText={helperText}
            label={label}
            placeholder={placeholder}
            size={size}
            sx={{ flex: 1 }}
          />
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {showPreview && (
            <Paper
              ref={anchorRef}
              onClick={() => !disabled && setOpen(true)}
              sx={{
                width: size === 'small' ? 32 : 40,
                height: size === 'small' ? 32 : 40,
                cursor: disabled ? 'default' : 'pointer',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: value,
                opacity: disabled ? 0.5 : 1
              }}
            />
          )}

          {!showPreview && (
            <IconButton
              ref={anchorRef}
              onClick={() => !disabled && setOpen(true)}
              disabled={disabled}
              size={size}
            >
              <ColorizeIcon />
            </IconButton>
          )}

          {showCopy && (
            <Tooltip
              title={copied ? '복사됨!' : '색상 코드 복사'}
              placement="top"
            >
              <IconButton
                onClick={handleCopy}
                disabled={disabled}
                size={size}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        sx={{
          '& .MuiPopover-paper': {
            mt: 1,
            boxShadow: theme.shadows[8]
          }
        }}
      >
        {renderColorPicker()}
      </Popover>
    </Box>
  );
};

// 프리셋 색상
ColorPicker.defaultPresetColors = [
  '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321',
  '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2',
  '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF'
];

export default ColorPicker;