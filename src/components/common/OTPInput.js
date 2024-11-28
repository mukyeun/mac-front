import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentPaste as PasteIcon,
  Backspace as BackspaceIcon
} from '@mui/icons-material';

const OTPInput = ({
  value = '',
  onChange,
  length = 6,
  type = 'number',
  autoFocus = true,
  disabled = false,
  error = false,
  helperText,
  label,
  placeholder = '●',
  showMask = true,
  allowPaste = true,
  size = 'medium',
  spacing = 2,
  inputProps = {},
  sx = {}
}) => {
  const theme = useTheme();
  const [values, setValues] = useState(Array(length).fill(''));
  const [focused, setFocused] = useState(autoFocus ? 0 : -1);
  const [showValue, setShowValue] = useState(!showMask);
  const inputRefs = useRef([]);

  // 외부 value prop과 동기화
  useEffect(() => {
    const newValues = value.split('').slice(0, length);
    setValues([...newValues, ...Array(length - newValues.length).fill('')]);
  }, [value, length]);

  // 입력값 변경 처리
  const handleChange = (index, event) => {
    const newValue = event.target.value;
    const lastChar = newValue.slice(-1);

    // 숫자만 허용
    if (type === 'number' && !/^\d*$/.test(lastChar)) {
      return;
    }

    const newValues = [...values];
    newValues[index] = lastChar;
    setValues(newValues);

    // 다음 입력칸으로 포커스 이동
    if (lastChar && index < length - 1) {
      inputRefs.current[index + 1].focus();
      setFocused(index + 1);
    }

    // onChange 콜백 호출
    if (onChange) {
      onChange(newValues.join(''));
    }
  };

  // 키보드 입력 처리
  const handleKeyDown = (index, event) => {
    switch (event.key) {
      case 'Backspace':
        if (!values[index]) {
          // 현재 입력칸이 비어있으면 이전 입력칸으로 이동
          if (index > 0) {
            inputRefs.current[index - 1].focus();
            setFocused(index - 1);
            const newValues = [...values];
            newValues[index - 1] = '';
            setValues(newValues);
            if (onChange) {
              onChange(newValues.join(''));
            }
          }
        }
        break;

      case 'ArrowLeft':
        if (index > 0) {
          inputRefs.current[index - 1].focus();
          setFocused(index - 1);
        }
        break;

      case 'ArrowRight':
        if (index < length - 1) {
          inputRefs.current[index + 1].focus();
          setFocused(index + 1);
        }
        break;

      default:
        break;
    }
  };

  // 포커스 처리
  const handleFocus = (index) => {
    setFocused(index);
    inputRefs.current[index].select();
  };

  const handleBlur = () => {
    setFocused(-1);
  };

  // 붙여넣기 처리
  const handlePaste = async () => {
    if (!allowPaste || disabled) return;

    try {
      const text = await navigator.clipboard.readText();
      const pasteValues = text.slice(0, length).split('');

      if (type === 'number' && !/^\d+$/.test(text)) {
        return;
      }

      const newValues = [
        ...pasteValues,
        ...Array(length - pasteValues.length).fill('')
      ];

      setValues(newValues);
      if (onChange) {
        onChange(newValues.join(''));
      }

      // 마지막 입력칸으로 포커스 이동
      const lastIndex = Math.min(pasteValues.length, length - 1);
      inputRefs.current[lastIndex].focus();
      setFocused(lastIndex);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  // 전체 삭제 처리
  const handleClear = () => {
    if (disabled) return;
    
    const newValues = Array(length).fill('');
    setValues(newValues);
    if (onChange) {
      onChange('');
    }
    inputRefs.current[0].focus();
    setFocused(0);
  };

  return (
    <Box sx={sx}>
      {label && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          {label}
        </Typography>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing
        }}
      >
        {values.map((value, index) => (
          <TextField
            key={index}
            inputRef={el => inputRefs.current[index] = el}
            value={showValue ? value : value ? placeholder : ''}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            disabled={disabled}
            error={error}
            type={showValue ? 'text' : 'password'}
            variant="outlined"
            size={size}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                padding: size === 'small' ? 8 : 14,
                width: size === 'small' ? 24 : 32,
                fontFamily: type === 'number' ? 'monospace' : 'inherit'
              },
              ...inputProps
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              },
              '& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                display: 'none'
              }
            }}
          />
        ))}

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {showMask && (
            <Tooltip title={showValue ? '값 숨기기' : '값 표시'}>
              <IconButton
                size="small"
                onClick={() => setShowValue(!showValue)}
                disabled={disabled}
              >
                {showValue ? (
                  <VisibilityOffIcon fontSize="small" />
                ) : (
                  <VisibilityIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}

          {allowPaste && (
            <Tooltip title="붙여넣기">
              <IconButton
                size="small"
                onClick={handlePaste}
                disabled={disabled}
              >
                <PasteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="전체 삭제">
            <IconButton
              size="small"
              onClick={handleClear}
              disabled={disabled || !values.some(v => v)}
            >
              <BackspaceIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {helperText && (
        <Typography
          variant="caption"
          color={error ? 'error' : 'text.secondary'}
          sx={{ mt: 1, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default OTPInput;