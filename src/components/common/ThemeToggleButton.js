import React from 'react';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggleButton = () => {
  const { mode, toggleMode } = useTheme();
  
  return (
    <IconButton 
      onClick={toggleMode} 
      color="inherit"
      sx={{ 
        ml: 2,
        color: mode === 'dark' ? 'white' : 'black'
      }}
    >
      {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

export default ThemeToggleButton;
