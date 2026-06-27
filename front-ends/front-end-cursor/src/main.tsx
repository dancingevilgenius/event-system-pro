import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppThemeProvider from './context/AppThemeProvider';
import AuthProvider from './context/AuthProvider';
import MessageProvider from './context/MessageProvider';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <MessageProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </MessageProvider>
    </AppThemeProvider>
  </StrictMode>,
);
