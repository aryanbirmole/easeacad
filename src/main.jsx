import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variable.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

const savedTheme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)