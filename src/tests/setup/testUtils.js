import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../../contexts/AuthContext';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const AllTheProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
