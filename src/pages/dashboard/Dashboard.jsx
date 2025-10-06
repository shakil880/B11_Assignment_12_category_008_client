import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', background: 'white', padding: '20px', borderRight: '1px solid #ddd' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>Dashboard</h2>
          <p style={{ fontSize: '14px', color: '#666' }}>Welcome, {user?.displayName || user?.email}</p>
          {userRole && userRole !== 'user' && (
            <div style={{ 
              marginTop: '8px', 
              padding: '4px 8px', 
              backgroundColor: userRole === 'admin' ? '#fef2f2' : '#eff6ff',
              color: userRole === 'admin' ? '#dc2626' : '#2563eb',
              borderRadius: '4px', 
              fontSize: '12px', 
              fontWeight: '500',
              textTransform: 'capitalize'
            }}>
              {userRole === 'admin' ? '👑' : '🏢'} {userRole}
            </div>
          )}
        </div>
        
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navItems.map((item) => (
              <li key={item.path} style={{ marginBottom: '5px' }}>
                <Link 
                  to={item.path} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '12px 16px', 
                    textDecoration: 'none', 
                    borderRadius: '6px',
                    backgroundColor: window.location.pathname === item.path ? '#3B82F6' : 'transparent',
                    color: window.location.pathname === item.path ? 'white' : '#374151'
                  }}
                >
                  <span style={{ marginRight: '12px', fontSize: '16px' }}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
          <Route path="/" element={
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Welcome to Dashboard</h1>
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
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Manage Reviews</h1>
              <p>Review management will appear here.</p>
            </div>
          } />
          
          <Route path="*" element={
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
              <Link to="/dashboard" style={{ color: '#3B82F6', textDecoration: 'none' }}>← Back to Dashboard</Link>
            </div>
          } />
        </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;