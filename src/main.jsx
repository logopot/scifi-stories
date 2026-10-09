import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalStyle from './styles/GlobalStyle';
import { theme } from './styles/theme';
import App from './App';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
