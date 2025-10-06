import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import '../../styles/dashboard.css';

// Import actual dashboard components
import UserProfile from './user/UserProfile';
import UserWishlist from './user/UserWishlist';
import UserPropertyBought from './user/UserPropertyBought';
import UserReviews from './user/UserReviews';
import AddProperty from './Agent/AddProperty';
import MyProperties from './Agent/MyProperties';
import SoldProperties from './Agent/SoldProperties';
import RequestedProperties from './Agent/RequestedProperties';
import ManageProperties from './Admin/ManageProperties';
import ManageUsers from './Admin/ManageUsers';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Fetch user role from server
  const { data: userDetails } = useQuery({
    queryKey: ['user-details', user?.email],
    queryFn: async () => {
      try {
        const response = await api.get(`/users/${user.email}`, {
          headers: { 'user-email': user.email }
        });
        return response.data;
      } catch (error) {
        // Return default user role if fetch fails
        return { role: 'user' };
      }
    },
    enabled: !!user?.email,
    retry: 1,
  });

  const userRole = userDetails?.role || 'user';

  // Define all possible navigation items with proper role restrictions
  const allNavItems = [
    { path: '/dashboard/profile', label: 'My Profile', icon: '👤', roles: ['user', 'agent', 'admin'] },
    { path: '/dashboard/wishlist', label: 'Wishlist', icon: '❤️', roles: ['user', 'agent', 'admin'] },
    { path: '/dashboard/property-bought', label: 'Property Bought', icon: '🏠', roles: ['user', 'agent', 'admin'] },
    { path: '/dashboard/my-reviews', label: 'My Reviews', icon: '⭐', roles: ['user', 'agent', 'admin'] },
    // Add Property for agents and admins (admin properties are auto-verified)
    { path: '/dashboard/add-property', label: 'Add Property', icon: '➕', roles: ['agent', 'admin'] },
    { path: '/dashboard/my-properties', label: 'My Properties', icon: '🏘️', roles: ['agent', 'admin'] },
    { path: '/dashboard/sold-properties', label: 'Sold Properties', icon: '💰', roles: ['agent', 'admin'] },
    { path: '/dashboard/requested-properties', label: 'Requested Properties', icon: '📋', roles: ['agent', 'admin'] },
    { path: '/dashboard/manage-properties', label: 'Manage Properties', icon: '🏢', roles: ['admin'] },
    // Manage Users only for admins (hidden from all other roles)
    { path: '/dashboard/manage-users', label: 'Manage Users', icon: '👥', roles: ['admin'] },
    { path: '/dashboard/manage-reviews', label: 'Manage Reviews', icon: '📝', roles: ['admin'] },
  ];

  // Filter navigation items based on user role
  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="dashboard-layout">
      <div className="container">
        <div className="dashboard-container">
          {/* Sidebar */}
          <div className="dashboard-sidebar">
            <div className="dashboard-header">
              <h2 className="dashboard-title">Dashboard</h2>
              <p className="dashboard-welcome">Welcome, {user?.displayName || user?.email}</p>
              {userRole && userRole !== 'user' && (
                <div className={`dashboard-role-badge ${userRole}`}>
                  {userRole === 'admin' ? '👑' : '🏢'} {userRole}
                </div>
              )}
            </div>
            
            <nav className="dashboard-nav">
              <ul className="dashboard-nav-list">
                {navItems.map((item) => (
                  <li key={item.path} className="dashboard-nav-item">
                    <Link 
                      to={item.path} 
                      className={`dashboard-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                      <span className="dashboard-nav-icon">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="dashboard-content">
            <Routes>
              <Route path="/" element={
                <div className="dashboard-welcome-card">
                  <h1 className="dashboard-content-title">Welcome to Dashboard</h1>
                  <p>Select an option from the sidebar to get started.</p>
                </div>
              } />
              
              <Route path="profile" element={<UserProfile />} />
              
              <Route path="wishlist" element={<UserWishlist />} />
              
              <Route path="property-bought" element={<UserPropertyBought />} />
              
              <Route path="my-reviews" element={<UserReviews />} />
              
              <Route path="add-property" element={<AddProperty />} />
              
              <Route path="my-properties" element={<MyProperties />} />
              
              <Route path="sold-properties" element={<SoldProperties />} />
              
              <Route path="requested-properties" element={<RequestedProperties />} />
              
              <Route path="manage-properties" element={<ManageProperties />} />
              
              <Route path="manage-users" element={<ManageUsers />} />
              
              <Route path="manage-reviews" element={
                <div className="dashboard-welcome-card">
                  <h1 className="dashboard-content-title">Manage Reviews</h1>
                  <p>Review management will appear here.</p>
                </div>
              } />
              
              <Route path="*" element={
                <div className="dashboard-welcome-card">
                  <h1 className="dashboard-content-title">Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <Link to="/dashboard" className="dashboard-back-link">← Back to Dashboard</Link>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;