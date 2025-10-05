import { Link, useLocation } from 'react-router-dom';

const DashboardSidebar = ({ userRole }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const getUserRoutes = () => {
    const commonRoutes = [
      { path: '/dashboard/profile', label: 'My Profile', icon: '👤' }
    ];

    if (userRole === 'user') {
      return [
        ...commonRoutes,
        { path: '/dashboard/wishlist', label: 'Wishlist', icon: '❤️' },
        { path: '/dashboard/property-bought', label: 'Property Bought', icon: '🏠' },
        { path: '/dashboard/my-reviews', label: 'My Reviews', icon: '⭐' },
      ];
    }

    if (userRole === 'agent') {
      return [
        ...commonRoutes,
        { path: '/dashboard/add-property', label: 'Add Property', icon: '➕' },
        { path: '/dashboard/my-properties', label: 'My Properties', icon: '🏢' },
        { path: '/dashboard/sold-properties', label: 'Sold Properties', icon: '💰' },
        { path: '/dashboard/requested-properties', label: 'Requested Properties', icon: '📋' },
      ];
    }

    if (userRole === 'admin') {
      return [
        ...commonRoutes,
        { path: '/dashboard/manage-properties', label: 'Manage Properties', icon: '🏘️' },
        { path: '/dashboard/manage-users', label: 'Manage Users', icon: '👥' },
        { path: '/dashboard/manage-reviews', label: 'Manage Reviews', icon: '📝' },
      ];
    }

    return commonRoutes;
  };

  const routes = getUserRoutes();

  return (
    <div className="dashboard-sidebar">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-sm text-gray-600 capitalize">{userRole} Panel</p>
      </div>

      <nav>
        <ul className="sidebar-nav">
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                to={route.path}
                className={`sidebar-nav-link ${isActive(route.path) ? 'active' : ''}`}
              >
                <span className="mr-3">{route.icon}</span>
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default DashboardSidebar;