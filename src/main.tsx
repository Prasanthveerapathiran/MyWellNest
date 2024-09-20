import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TokenProvider } from './api/Token';


const theme = createTheme();

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TokenProvider>
     
          <App />
       
      </TokenProvider>
    </ThemeProvider>
  );
} else {
  console.error('Failed to find the root element');
}

