import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

const FilterPanel = ({ filters, onFilterChange }) => {
  const handleClear = (filterType) => {
    onFilterChange({ ...filters, [filterType]: '' });
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mb: 2,
        p: 2,
        backgroundColor: 'background.default',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2
      }}
    >
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>상태</InputLabel>
        <Select
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          label="상태"
        >
          <MenuItem value="">전체</MenuItem>
          <MenuItem value="정상">정상</MenuItem>
          <MenuItem value="주의">주의</MenuItem>
          <MenuItem value="위험">위험</MenuItem>
        </Select>
        {filters.status && (
          <Tooltip title="필터 초기화">
            <IconButton
              size="small"
              onClick={() => handleClear('status')}
              sx={{ position: 'absolute', right: 28, top: 8 }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>기간</InputLabel>
        <Select
          value={filters.period || ''}
          onChange={(e) => onFilterChange({ ...filters, period: e.target.value })}
          label="기간"
        >
          <MenuItem value="">전체기간</MenuItem>
          <MenuItem value="1week">1주일</MenuItem>
          <MenuItem value="1month">1개월</MenuItem>
          <MenuItem value="3months">3개월</MenuItem>
          <MenuItem value="6months">6개월</MenuItem>
        </Select>
        {filters.period && (
          <Tooltip title="필터 초기화">
            <IconButton
              size="small"
              onClick={() => handleClear('period')}
              sx={{ position: 'absolute', right: 28, top: 8 }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </FormControl>

      {Object.entries(filters).some(([_, value]) => value) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            활성 필터:
          </Typography>
          {filters.status && (
            <Chip
              label={`상태: ${filters.status}`}
              onDelete={() => handleClear('status')}
              size="small"
            />
          )}
          {filters.period && (
            <Chip
              label={`기간: ${filters.period}`}
              onDelete={() => handleClear('period')}
              size="small"
            />
          )}
        </Box>
      )}
    </Paper>
  );
};

export default FilterPanel;