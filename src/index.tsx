import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from '@/App';
import { AuthProvider } from '@/contexts/AuthContext';

// Performance optimizations
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    // Registrar o service worker com a versão do build
    const buildVersion = (globalThis as any).__BUILD_VERSION__ || Date.now();
    navigator.serviceWorker.register('/sw.js?v=' + buildVersion)
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Verificar atualizações do service worker
        registration.update();
        
        // Escutar por atualizações
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nova versão disponível
                console.log('New content is available, please refresh.');
                // Opcional: mostrar notificação para o usuário atualizar
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Enable React concurrent mode features
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);