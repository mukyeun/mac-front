import React from 'react';
import {
  Box,
  Chip,
  Button,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const FilterChips = ({
  filters = [],
  onRemove,
  onRemoveAll,
  onFilterClick,
  loading = false,
  disabled = false,
  showFilterIcon = true,
  showClearAll = true,
  clearAllText = '필터 초기화',
  noFiltersText = '적용된 필터가 없습니다',
  variant = 'outlined',
  size = 'medium',
  sx = {}
}) => {
  const theme = useTheme();

  // 필터 라벨 포맷팅
  const formatFilterLabel = (filter) => {
    if (filter.formatLabel) {
      return filter.formatLabel(filter);
    }

    if (filter.label) {
      return filter.label;
    }

    if (filter.value && typeof filter.value === 'object') {
      return `${filter.field}: ${Object.values(filter.value).join(', ')}`;
    }

    return `${filter.field}: ${filter.value}`;
  };

  // 필터 툴팁 생성
  const getFilterTooltip = (filter) => {
    if (filter.tooltip) {
      return typeof filter.tooltip === 'function' 
        ? filter.tooltip(filter) 
        : filter.tooltip;
    }
    return formatFilterLabel(filter);
  };

  // 필터 칩 색상 설정
  const getChipColor = (filter) => {
    if (filter.color && theme.palette[filter.color]) {
      return filter.color;
    }
    return 'default';
  };

  // 필터 칩 아이콘 설정
  const getChipIcon = (filter) => {
    if (filter.icon) {
      const Icon = filter.icon;
      return <Icon fontSize="small" />;
    }
    if (showFilterIcon) {
      return <FilterIcon fontSize="small" />;
    }
    return null;
  };

  if (filters.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'text.secondary',
          ...sx 
        }}
      >
        <FilterIcon fontSize="small" />
        <Typography variant="body2">
          {noFiltersText}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        alignItems: 'center',
        ...sx
      }}
    >
      {filters.map((filter, index) => (
        <Tooltip
          key={`${filter.field}-${index}`}
          title={getFilterTooltip(filter)}
        >
          <Chip
            label={formatFilterLabel(filter)}
            onDelete={
              filter.permanent 
                ? undefined 
                : () => onRemove(filter)
            }
            onClick={() => {
              if (onFilterClick && !disabled) {
                onFilterClick(filter);
              }
            }}
            icon={getChipIcon(filter)}
            color={getChipColor(filter)}
            variant={variant}
            size={size}
            disabled={disabled || loading}
            sx={{
              maxWidth: '100%',
              '& .MuiChip-label': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              },
              ...(onFilterClick && !disabled ? {
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              } : {}),
              ...filter.sx
            }}
          />
        </Tooltip>
      ))}

      {showClearAll && filters.some(f => !f.permanent) && (
        <Button
          size="small"
          onClick={onRemoveAll}
          disabled={disabled || loading}
          startIcon={<ClearIcon />}
          sx={{ ml: 1 }}
        >
          {clearAllText}
        </Button>
      )}
    </Box>
  );
};

export default FilterChips;