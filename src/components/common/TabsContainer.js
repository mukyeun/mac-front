import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Paper,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import TabPanel, { a11yProps } from './TabPanel';

const TabsContainer = ({ 
  tabs,
  defaultTab = 0,
  orientation = 'horizontal',
  variant = 'standard',
  padding = 3,
  elevation = 1,
  onChange
}) => {
  const [value, setValue] = useState(defaultTab);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Paper 
      elevation={elevation}
      sx={{ 
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'row' : 'column',
        height: orientation === 'vertical' ? '100%' : 'auto'
      }}
    >
      <Box sx={{ 
        borderBottom: orientation === 'horizontal' ? 1 : 0,
        borderRight: orientation === 'vertical' ? 1 : 0,
        borderColor: 'divider'
      }}>
        <Tabs
          value={value}
          onChange={handleChange}
          orientation={orientation}
          variant={isMobile ? 'scrollable' : variant}
          scrollButtons={isMobile ? 'auto' : false}
          aria-label="tabs"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition={tab.iconPosition || 'start'}
              disabled={tab.disabled}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab, index) => (
        <TabPanel 
          key={index} 
          value={value} 
          index={index}
          padding={padding}
        >
          {tab.content}
        </TabPanel>
      ))}
    </Paper>
  );
};

export default TabsContainer;