import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Handle Vercel Deployment asset refresh errors
window.addEventListener('error', (e) => {
  if (e.message.includes('Failed to fetch dynamically imported module')) {
    console.warn('System update detected. Refreshing for latest version...');
    window.location.reload();
  }
}, true);

window.addEventListener('unhandledrejection', (e) => {
  if (e.reason?.message?.includes('Failed to fetch dynamically imported module')) {
    console.warn('System update detected. Refreshing for latest version...');
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
