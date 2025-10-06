import { useAuth } from '../../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';

const UserProfile = () => {
  const { user } = useAuth();

  // Fetch user details from server
  const { data: userDetails, isLoading, error } = useQuery({
    queryKey: ['user-details', user?.email],
    queryFn: async () => {
      try {
        console.log('Fetching user details for:', user.email);
        const response = await api.get(`/users/${user.email}`, {
          headers: { 'user-email': user.email }
        });
        console.log('User details response:', response.data);
        return response.data;
      } catch (error) {
        console.log('User fetch error:', error.response?.status);
        // If user doesn't exist in database, create them and return basic data
        if (error.response?.status === 404) {
          console.log('User not found, creating new user');
          const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL,
            role: 'user',
          };
          
          const createResponse = await api.post('/users', userData, {
            headers: { 'user-email': user.email }
          });
          
          return {
            ...userData,
            createdAt: new Date().toISOString(),
            isActive: true,
          };
        }
        throw error;
      }
    },
    enabled: !!user?.email,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 sm:p-8">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-sm sm:text-base">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-0">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-red-600 text-sm sm:text-base">Error loading profile: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl w-full mx-auto px-4 sm:px-0">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage your personal information</p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8">
            <div className="relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user?.displayName || 'User'}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-2xl sm:text-3xl font-bold">
                    {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {user?.displayName || 'No Name'}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">{user?.email}</p>
              {userDetails?.role && userDetails.role !== 'user' && (
                <span className={`badge ${
                  userDetails.role === 'admin' ? 'badge-danger' :
                  userDetails.role === 'agent' ? 'badge-info' : 'badge-success'
                } mt-2`}>
                  {userDetails.role}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="form-label">Full Name</label>
                <div className="p-3 bg-gray-50 rounded border">
                  {user?.displayName || 'Not provided'}
                </div>
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <div className="p-3 bg-gray-50 rounded border">
                  {user?.email}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="form-label">Account Type</label>
                <div className="p-3 bg-gray-50 rounded border capitalize flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span>{userDetails?.role || 'User'}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userDetails?.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : userDetails?.role === 'agent' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {userDetails?.role === 'admin' && '👑 Admin'}
                      {userDetails?.role === 'agent' && '🏢 Agent'}
                      {userDetails?.role === 'user' && '👤 User'}
                    </span>
                  </div>
                  {userDetails?.role === 'agent' && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      userDetails?.isVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {userDetails?.isVerified ? '✅ Verified' : '⏳ Pending'}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="form-label">Member Since</label>
                <div className="p-3 bg-gray-50 rounded border">
                  {userDetails?.createdAt 
                    ? new Date(userDetails.createdAt).toLocaleDateString()
                    : 'Recently joined'
                  }
                </div>
              </div>
            </div>

            {/* Role-specific information */}
            {userDetails?.role === 'agent' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Agent Status</label>
                  <div className="p-3 bg-gray-50 rounded border">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userDetails.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {userDetails.isVerified ? '✅ Verified Agent' : '⏳ Pending Verification'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="form-label">Properties Listed</label>
                  <div className="p-3 bg-gray-50 rounded border">
                    <span className="text-lg font-semibold text-blue-600">
                      {userDetails.propertiesCount || 0}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">properties</span>
                  </div>
                </div>
              </div>
            )}

            {userDetails?.role === 'admin' && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  {/* <span className="text-2xl">👑</span> */}
                  <h3 className="text-lg font-semibold text-purple-900">Administrator Privileges</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span>Manage all users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span>Moderate properties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span>System oversight</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Role-based Action Sections */}
          {userDetails?.role === 'user' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">🏢 Become an Agent</h3>
                <p className="text-blue-700 mb-4">
                  Upgrade to an agent account to list and manage properties on our platform. 
                  As an agent, you'll be able to showcase properties and connect with potential buyers.
                </p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      if (confirm('Do you want to request agent access? This will allow you to list and manage properties.')) {
                        alert('Agent request submitted! An administrator will review your request shortly.');
                      }
                    }}
                    className="btn btn-primary"
                  >
                    Request Agent Access
                  </button>
                  <div className="text-xs text-blue-600">
                    ⚡ Quick approval process
                  </div>
                </div>
              </div>
            </div>
          )}

          {userDetails?.role === 'agent' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">🏠 Agent Dashboard</h3>
                <p className="text-green-700 mb-4">
                  You have agent privileges! Manage your property listings and track your performance.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-100">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{userDetails.propertiesCount || 0}</div>
                    <div className="text-xs sm:text-sm text-green-700">Properties Listed</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-100">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{userDetails.inquiriesCount || 0}</div>
                    <div className="text-xs sm:text-sm text-green-700">Inquiries Received</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-100">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{userDetails.salesCount || 0}</div>
                    <div className="text-xs sm:text-sm text-green-700">Properties Sold</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            
            {/* Common actions for all users */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">General Actions</h4>
              <div className="flex flex-wrap gap-3">
                <a href="/properties" className="btn btn-primary">
                  🏠 Browse Properties
                </a>
                <a href="/dashboard/wishlist" className="btn btn-outline">
                  ❤️ View Wishlist
                </a>
                <a href="/dashboard/my-reviews" className="btn btn-outline">
                  ⭐ My Reviews
                </a>
              </div>
            </div>

            {/* Role-specific actions */}
            {userDetails?.role === 'agent' && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-blue-700 mb-3">Agent Actions</h4>
                <div className="flex flex-wrap gap-3">
                  <a href="/dashboard/add-property" className="btn btn-secondary">
                    ➕ Add Property
                  </a>
                  <a href="/dashboard/my-properties" className="btn btn-outline">
                    🏢 My Properties
                  </a>
                  <a href="/dashboard/requested-properties" className="btn btn-outline">
                    📋 Property Requests
                  </a>
                  <a href="/dashboard/sold-properties" className="btn btn-outline">
                    💰 Sold Properties
                  </a>
                </div>
              </div>
            )}

            {userDetails?.role === 'admin' && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-purple-700 mb-3">Admin Actions</h4>
                <div className="flex flex-wrap gap-3">
                  <a href="/dashboard/add-property" className="btn btn-secondary">
                    ➕ Add Property
                  </a>
                  <a href="/dashboard/manage-users" className="btn btn-warning">
                    👥 Manage Users
                  </a>
                  <a href="/dashboard/manage-properties" className="btn btn-warning">
                    🏘️ Manage Properties
                  </a>
                  <a href="/dashboard/manage-reviews" className="btn btn-outline">
                    📝 Manage Reviews
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
