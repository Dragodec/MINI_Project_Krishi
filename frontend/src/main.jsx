import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './Context/LanguageContext' // Lowercase 'context'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1a2e05',
            borderRadius: '12px',
          },
        }}
      />
      <App />
    </LanguageProvider>
  </StrictMode>,
)