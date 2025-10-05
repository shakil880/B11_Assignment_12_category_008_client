import { QueryClientProvider } from '@tanstack/react-query';

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
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
