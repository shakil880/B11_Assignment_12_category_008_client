import { useAuth } from '../../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';

const UserProfile = () => {
  const { user } = useAuth();

  // Temporarily use Firebase user data directly
  const userDetails = {
    uid: user?.uid,
    email: user?.email,
    name: user?.displayName,
    photoURL: user?.photoURL,
    role: 'user',
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  const isLoading = false;

  // TODO: Re-enable API call once working
  /*
  const { data: userDetails, isLoading, error } = useQuery({
    queryKey: ['user-details', user?.email],
    queryFn: async () => {
      try {
        const response = await api.get(`/users/${user.email}`);
        return response.data;
      } catch (error) {
        // If user doesn't exist in database, create them and return basic data
        if (error.response?.status === 404) {
          const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL,
            role: 'user',
          };
          await api.post('/users', userData);
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
  */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner"></div>
        <span className="ml-3">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <img
                src={user?.photoURL || '/default-avatar.png'}
                alt={user?.displayName || 'User'}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {user?.displayName || 'No Name'}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
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
            <div className="grid grid-cols-2 gap-6">
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

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="form-label">Account Type</label>
                <div className="p-3 bg-gray-50 rounded border capitalize">
                  {userDetails?.role || 'User'}
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

            {userDetails?.role === 'agent' && (
              <div>
                <label className="form-label">Agent Status</label>
                <div className="p-3 bg-gray-50 rounded border">
                  <span className={`badge ${
                    userDetails.isVerified ? 'badge-success' : 'badge-warning'
                  }`}>
                    {userDetails.isVerified ? 'Verified Agent' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <a href="/properties" className="btn btn-primary">
                Browse Properties
              </a>
              <a href="/dashboard/wishlist" className="btn btn-outline">
                View Wishlist
              </a>
              <a href="/dashboard/my-reviews" className="btn btn-outline">
                My Reviews
              </a>
              {userDetails?.role === 'agent' && (
                <a href="/dashboard/add-property" className="btn btn-secondary">
                  Add Property
                </a>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Account Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stat-card">
                <div className="stat-value">
                  {userDetails?.role === 'user' ? '🏠' : userDetails?.role === 'agent' ? '🏢' : '👑'}
                </div>
                <div className="stat-label">Account Type</div>
                <div className="text-sm text-gray-600 mt-1 capitalize">
                  {userDetails?.role || 'User'}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-value">📅</div>
                <div className="stat-label">Member Since</div>
                <div className="text-sm text-gray-600 mt-1">
                  {userDetails?.createdAt 
                    ? new Date(userDetails.createdAt).toLocaleDateString()
                    : 'Recently'
                  }
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-value">✅</div>
                <div className="stat-label">Status</div>
                <div className="text-sm text-gray-600 mt-1">
                  {userDetails?.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;