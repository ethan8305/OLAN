import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './i18n'; // initialise i18next before any component renders
import './index.css';

// Google OAuth is the PRIMARY login. The client ID comes from .env.local
// (VITE_GOOGLE_CLIENT_ID). If it's missing, the provider still mounts and the
// Auth screen falls back to email + password so local dev isn't blocked.
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
