import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

// Import dashboard components
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
// User components
import UserProfile from './User/UserProfile';
import UserWishlist from './User/UserWishlist';
import UserPropertyBought from './User/UserPropertyBought';
import UserReviews from './User/UserReviews';
// Agent components
import AddProperty from './Agent/AddProperty';
import MyProperties from './Agent/MyProperties';
import SoldProperties from './Agent/SoldProperties';
import RequestedProperties from './Agent/RequestedProperties';
// Admin components
import ManageProperties from './Admin/ManageProperties';
import ManageUsers from './Admin/ManageUsers';
import DashboardDebug from './DashboardDebug';

const Dashboard = () => {
  const { user } = useAuth();

  console.log('Dashboard component rendered - user:', !!user, user?.email);

  // Fetch user role from backend
  const { data: userRole = 'user', isLoading, error } = useQuery({
    queryKey: ['user-role', user?.email],
    queryFn: async () => {
      if (!user?.email) return 'user';
      try {
        const response = await api.get(`/users/${user.email}`);
        return response.data.role || 'user';
      } catch (error) {
        // If user doesn't exist in database, create them
        if (error.response?.status === 404) {
          const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL,
            role: 'user',
          };
          await api.post('/users', userData);
          return 'user';
        }
        throw error;
      }
    },
    enabled: !!user?.email,
    retry: 1,
  });

  console.log('Dashboard state - isLoading:', isLoading, 'error:', !!error, 'userRole:', userRole);

  if (isLoading) {
    console.log('Dashboard showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
        <span className="ml-3">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    console.log('Dashboard showing error state:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Dashboard Error
          </h2>
          <p className="text-gray-600 mb-6">
            Error: {error?.message || 'Unable to load dashboard'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  console.log('Dashboard rendering main content');

  return (
    <div className="dashboard-container">
      <DashboardSidebar userRole={userRole} />
      
      <div className="dashboard-content">
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="profile" replace />} />
          
          {/* Common routes */}
          <Route path="profile" element={<UserProfile />} />
          
          {/* User routes */}
          {userRole === 'user' && (
            <>
              <Route path="wishlist" element={<UserWishlist />} />
              <Route path="property-bought" element={<UserPropertyBought />} />
              <Route path="my-reviews" element={<UserReviews />} />
            </>
          )}
          
          {/* Agent routes */}
          {userRole === 'agent' && (
            <>
              <Route path="add-property" element={<AddProperty />} />
              <Route path="my-properties" element={<MyProperties />} />
              <Route path="sold-properties" element={<SoldProperties />} />
              <Route path="requested-properties" element={<RequestedProperties />} />
            </>
          )}
          
          {/* Admin routes */}
          {userRole === 'admin' && (
            <>
              <Route path="manage-properties" element={<ManageProperties />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="manage-reviews" element={<div>Manage Reviews (Coming Soon)</div>} />
            </>
          )}
          
          {/* Fallback */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;