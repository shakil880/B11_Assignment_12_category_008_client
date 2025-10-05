import { useAuth } from '../../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';

const UserProfile = () => {
  const { user } = useAuth();

  const { data: userDetails, isLoading } = useQuery({
    queryKey: ['user-details', user?.uid],
    queryFn: async () => {
      const response = await api.get(`/users/${user.uid}`);
      return response.data;
    },
    enabled: !!user,
  });

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
            <h3 className="text-lg font-semibold mb-4">Account Statistics</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {userDetails?.stats?.totalProperties || 0}
                </div>
                <div className="text-sm text-blue-600">
                  {userDetails?.role === 'agent' ? 'Listed Properties' : 'Wishlist Items'}
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {userDetails?.stats?.totalReviews || 0}
                </div>
                <div className="text-sm text-green-600">Reviews Given</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {userDetails?.stats?.totalTransactions || 0}
                </div>
                <div className="text-sm text-purple-600">
                  {userDetails?.role === 'agent' ? 'Properties Sold' : 'Properties Bought'}
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