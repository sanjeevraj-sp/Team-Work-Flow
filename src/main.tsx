import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './Context/Toast.tsx';
import { TaskProvider } from './Context/Task.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </ToastProvider>
  </StrictMode>
)
