import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Popper,
  Grow,
  ClickAwayListener,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as ClearIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';

const SearchInput = ({
  placeholder = '검색어를 입력하세요',
  value = '',
  onChange,
  onSearch,
  onClear,
  loading = false,
  suggestions = [],
  recentSearches = [],
  trendingSearches = [],
  maxSuggestions = 5,
  maxRecentSearches = 5,
  maxTrendingSearches = 5,
  showSuggestions = true,
  showRecentSearches = true,
  showTrendingSearches = true,
  debounceDelay = 300,
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  disabled = false,
  sx = {}
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const anchorRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    // 디바운스 처리
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (onChange) {
        onChange(newValue);
      }
    }, debounceDelay);

    // 입력값이 있을 때만 팝업 표시
    setOpen(!!newValue);
  };

  const handleSearch = () => {
    if (onSearch && inputValue.trim()) {
      onSearch(inputValue.trim());
      setOpen(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setInputValue('');
    setOpen(false);
    if (onClear) {
      onClear();
    }
  };

  const handleSuggestionClick = (value) => {
    setInputValue(value);
    if (onChange) {
      onChange(value);
    }
    if (onSearch) {
      onSearch(value);
    }
    setOpen(false);
  };
  const renderSuggestions = () => {
    const hasContent = (
      (showSuggestions && suggestions.length > 0) ||
      (showRecentSearches && recentSearches.length > 0) ||
      (showTrendingSearches && trendingSearches.length > 0)
    );

    if (!hasContent) return null;

    return (
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        style={{ width: anchorRef.current?.offsetWidth, zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper elevation={3}>
              <List sx={{ py: 0 }}>
                {showSuggestions && suggestions.slice(0, maxSuggestions).map((item, index) => (
                  <ListItem
                    key={`suggestion-${index}`}
                    button
                    onClick={() => handleSuggestionClick(item)}
                    dense
                  >
                    <ListItemText primary={item} />
                  </ListItem>
                ))}

                {showRecentSearches && recentSearches.length > 0 && (
                  <>
                    <ListItem sx={{ py: 0 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ py: 1 }}
                      >
                        최근 검색어
                      </Typography>
                    </ListItem>
                    {recentSearches.slice(0, maxRecentSearches).map((item, index) => (
                      <ListItem
                        key={`recent-${index}`}
                        button
                        onClick={() => handleSuggestionClick(item)}
                        dense
                      >
                        <ListItemText 
                          primary={item}
                          primaryTypographyProps={{ fontSize: '0.875rem' }}
                        />
                        <HistoryIcon 
                          fontSize="small" 
                          sx={{ color: 'action.active', ml: 1 }} 
                        />
                      </ListItem>
                    ))}
                  </>
                )}

                {showTrendingSearches && trendingSearches.length > 0 && (
                  <>
                    <ListItem sx={{ py: 0 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ py: 1 }}
                      >
                        인기 검색어
                      </Typography>
                    </ListItem>
                    {trendingSearches.slice(0, maxTrendingSearches).map((item, index) => (
                      <ListItem
                        key={`trending-${index}`}
                        button
                        onClick={() => handleSuggestionClick(item)}
                        dense
                      >
                        <ListItemText 
                          primary={item}
                          primaryTypographyProps={{ fontSize: '0.875rem' }}
                        />
                        <TrendingIcon 
                          fontSize="small" 
                          sx={{ color: 'action.active', ml: 1 }} 
                        />
                      </ListItem>
                    ))}
                  </>
                )}
              </List>
            </Paper>
          </Grow>
        )}
      </Popper>
    );
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div>
        <TextField
          ref={anchorRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          disabled={disabled}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading && (
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                )}
                {inputValue && (
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'divider'
              },
              '&:hover fieldset': {
                borderColor: 'action.hover'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main'
              }
            },
            ...sx
          }}
        />
        {renderSuggestions()}
      </div>
    </ClickAwayListener>
  );
};

export default SearchInput;