import React from 'react';
import { Box } from '@mui/material';

const TabPanel = ({ 
  children, 
  value, 
  index, 
  padding = 3,
  ...other 
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: padding }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export const a11yProps = (index) => {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
};

export default TabPanel;