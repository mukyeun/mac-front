import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const Rating = ({
  value = 0,
  onChange,
  max = 5,
  precision = 1,
  size = 'medium',
  showClear = true,
  showValue = true,
  valuePosition = 'right',
  emptyIcon = <StarBorderIcon />,
  filledIcon = <StarIcon />,
  halfFilledIcon = <StarHalfIcon />,
  disabled = false,
  readOnly = false,
  label,
  helperText,
  error = false,
  color = 'primary',
  highlightSelectedOnly = false,
  tooltips = [],
  sx = {}
}) => {
  const theme = useTheme();
  const [hoverValue, setHoverValue] = useState(-1);

  // 아이콘 크기 계산
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  // 색상 계산
  const getColor = (index) => {
    const isActive = hoverValue >= 0 ? 
      Math.ceil(hoverValue) > index : 
      Math.ceil(value) > index;
    const isHalf = hoverValue >= 0 ? 
      Math.ceil(hoverValue) === index && hoverValue % 1 !== 0 : 
      Math.ceil(value) === index && value % 1 !== 0;

    if (error) {
      return isActive || isHalf ? theme.palette.error.main : theme.palette.error.light;
    }

    if (highlightSelectedOnly && value && index >= Math.ceil(value)) {
      return theme.palette.action.disabled;
    }

    return isActive || isHalf ? 
      theme.palette[color].main : 
      theme.palette.action.disabled;
  };

  // 값 변경 처리
  const handleChange = (newValue) => {
    if (disabled || readOnly) return;

    if (onChange) {
      // precision에 따라 값 반올림
      const roundedValue = Math.round(newValue / precision) * precision;
      onChange(roundedValue);
    }
  };

  // 마우스 이벤트 처리
  const handleMouseMove = (event, index) => {
    if (disabled || readOnly) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = x / rect.width;

    // precision에 따라 값 계산
    let newValue = index + 1;
    if (precision === 0.5 && percent <= 0.5) {
      newValue -= 0.5;
    }

    setHoverValue(newValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(-1);
  };

  // 클리어 버튼 처리
  const handleClear = (event) => {
    event.stopPropagation();
    if (disabled || readOnly) return;
    
    if (onChange) {
      onChange(0);
    }
  };

  // 별점 렌더링
  const renderStars = () => {
    const stars = [];
    const iconSize = getIconSize();

    for (let i = 0; i < max; i++) {
      const displayValue = hoverValue >= 0 ? hoverValue : value;
      const isActive = Math.ceil(displayValue) > i;
      const isHalf = Math.ceil(displayValue) === i + 1 && displayValue % 1 !== 0;
      
      const tooltip = tooltips[i] || `${i + 1} ${i === 0 ? '점' : '점'}`;

      stars.push(
        <Tooltip key={i} title={tooltip}>
          <Box
            onMouseMove={(e) => handleMouseMove(e, i)}
            onClick={() => handleChange(i + 1)}
            sx={{
              display: 'inline-flex',
              cursor: disabled || readOnly ? 'default' : 'pointer'
            }}
          >
            {React.cloneElement(
              isActive ? 
                (isHalf ? halfFilledIcon : filledIcon) : 
                emptyIcon,
              {
                sx: {
                  width: iconSize,
                  height: iconSize,
                  color: getColor(i),
                  transition: theme.transitions.create('color')
                }
              }
            )}
          </Box>
        </Tooltip>
      );
    }

    return stars;
  };

  return (
    <Box sx={sx}>
      {label && (
        <Typography
          variant="body2"
          color={error ? 'error' : 'text.secondary'}
          gutterBottom
        >
          {label}
        </Typography>
      )}

      <Box
        onMouseLeave={handleMouseLeave}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          opacity: disabled ? 0.5 : 1
        }}
      >
        {valuePosition === 'left' && showValue && (
          <Typography
            variant="body2"
            color={error ? 'error' : 'text.secondary'}
          >
            {value.toFixed(precision === 1 ? 0 : 1)}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderStars()}

          {showClear && value > 0 && !readOnly && (
            <Tooltip title="초기화">
              <IconButton
                size="small"
                onClick={handleClear}
                disabled={disabled}
                sx={{ ml: 1 }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {valuePosition === 'right' && showValue && (
          <Typography
            variant="body2"
            color={error ? 'error' : 'text.secondary'}
          >
            {value.toFixed(precision === 1 ? 0 : 1)}
          </Typography>
        )}
      </Box>

      {helperText && (
        <Typography
          variant="caption"
          color={error ? 'error' : 'text.secondary'}
          sx={{ mt: 0.5, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default Rating;