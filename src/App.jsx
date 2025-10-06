import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

// Providers
import { AuthProvider } from './contexts/AuthContext';

// Router
import AppRouter from './router/AppRouter';

// Config
import { queryClient } from './config/queryClient';

// Services
import keepAliveService from './services/keepAlive';

// Styles
import './App.css';

function App() {
  // Start keep-alive service when app loads
  useEffect(() => {
    keepAliveService.start();
    
    // Cleanup on unmount
    return () => {
      keepAliveService.stop();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
