import React, { useState } from 'react';
import { 
  Paper,
  InputBase,
  IconButton,
  Tooltip,
  Box
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const SearchBar = ({ 
  value, 
  onChange, 
  onSearch,
  placeholder = "이름으로 검색"
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleClear = () => {
    onChange({ target: { value: '' } });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%'
        }}
        elevation={1}
      >
        <IconButton 
          type="submit" 
          sx={{ p: '10px' }} 
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>

        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          value={value || ''}
          onChange={onChange}
          onKeyPress={handleKeyPress}
        />

        {value && (
          <Tooltip title="검색어 지우기">
            <IconButton 
              sx={{ p: '10px' }}
              aria-label="clear"
              onClick={handleClear}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Paper>
    </Box>
  );
};

export default SearchBar;