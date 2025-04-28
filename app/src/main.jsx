import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// Debug log to check if the environment variable is loaded correctly
console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log('Current origin:', window.location.origin);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GoogleOAuthProvider 
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            onScriptLoadError={() => console.error('Google OAuth script failed to load')}
            onScriptLoadSuccess={() => console.log('Google OAuth script loaded successfully')}
        >
            <App />
        </GoogleOAuthProvider>
    </StrictMode>,
)
