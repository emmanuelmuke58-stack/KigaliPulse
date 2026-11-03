import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { FontSizeProvider } from './contexts/FontSizeContext.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <FontSizeProvider>
          <App />
        </FontSizeProvider>
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>,
);
