import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

// Import dashboard components (we'll create these)
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import UserProfile from './User/UserProfile';
import UserWishlist from './User/UserWishlist';
import UserPropertyBought from './User/UserPropertyBought';
import UserReviews from './User/UserReviews';

const Dashboard = () => {
  const { user } = useAuth();

  // Get user role
  const { data: userRole = 'user', isLoading } = useQuery({
    queryKey: ['user-role', user?.uid],
    queryFn: async () => {
      if (!user) return 'user';
      const response = await api.get(`/users/${user.uid}`);
      return response.data.role;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
        <span className="ml-3">Loading dashboard...</span>
      </div>
    );
  }

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
              <Route path="add-property" element={<div>Add Property (Coming Soon)</div>} />
              <Route path="my-properties" element={<div>My Properties (Coming Soon)</div>} />
              <Route path="sold-properties" element={<div>Sold Properties (Coming Soon)</div>} />
              <Route path="requested-properties" element={<div>Requested Properties (Coming Soon)</div>} />
            </>
          )}
          
          {/* Admin routes */}
          {userRole === 'admin' && (
            <>
              <Route path="manage-properties" element={<div>Manage Properties (Coming Soon)</div>} />
              <Route path="manage-users" element={<div>Manage Users (Coming Soon)</div>} />
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