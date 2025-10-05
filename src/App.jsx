import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Providers
import { AuthProvider } from './contexts/AuthContext';

// Router
import AppRouter from './router/AppRouter';

// Config
import { queryClient } from './config/queryClient';

// Styles
import './App.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
        
        {/* Global Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
