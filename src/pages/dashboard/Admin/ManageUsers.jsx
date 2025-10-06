import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import { useState } from 'react';
import toast from '../../../utils/toast';

const ManageUsers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Fetch all users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const response = await api.get('/users', {
        headers: { 'user-email': user.email } // Admin access
      });
      return response.data;
    },
  });

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Make admin mutation
  const makeAdminMutation = useMutation({
    mutationFn: async (userId) => {
      await api.patch(`/users/admin/${userId}`, {}, {
        headers: { 'user-email': user.email }
      });
    },
    onSuccess: () => {
      toast.success('User promoted to admin');
      queryClient.invalidateQueries(['all-users']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to make admin');
    }
  });

  // Make agent mutation
  const makeAgentMutation = useMutation({
    mutationFn: async (userId) => {
      await api.patch(`/users/agent/${userId}`, {}, {
        headers: { 'user-email': user.email }
      });
    },
    onSuccess: () => {
      toast.success('User promoted to agent');
      queryClient.invalidateQueries(['all-users']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to make agent');
    }
  });

  // Mark fraud mutation
  const markFraudMutation = useMutation({
    mutationFn: async (userId) => {
      await api.patch(`/users/fraud/${userId}`, {}, {
        headers: { 'user-email': user.email }
      });
    },
    onSuccess: () => {
      toast.success('User marked as fraud');
      queryClient.invalidateQueries(['all-users']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to mark fraud');
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      await api.delete(`/users/${userId}`, {
        headers: { 'user-email': user.email }
      });
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries(['all-users']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  });

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`Change user role to ${newRole}?`)) {
      if (newRole === 'admin') {
        await makeAdminMutation.mutateAsync(userId);
      } else if (newRole === 'agent') {
        await makeAgentMutation.mutateAsync(userId);
      }
    }
  };

  const handleMarkFraud = async (userId) => {
    if (window.confirm('Mark this user as fraud? This action cannot be undone.')) {
      await markFraudMutation.mutateAsync(userId);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete this user permanently? This action cannot be undone.')) {
      await deleteUserMutation.mutateAsync(userId);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'badge-danger',
      agent: 'badge-success',
      user: 'badge-primary',
      fraud: 'badge-warning'
    };
    return badges[role] || 'badge-secondary';
  };

  const getRoleCounts = () => {
    return {
      all: users.length,
      admin: users.filter(u => u.role === 'admin').length,
      agent: users.filter(u => u.role === 'agent').length,
      user: users.filter(u => u.role === 'user').length,
      fraud: users.filter(u => u.role === 'fraud').length
    };
  };

  const roleCounts = getRoleCounts();

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
          <p className="text-gray-600">Loading users...</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="spinner"></div>
          <span className="ml-3">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
          <p className="text-gray-600">Error loading users</p>
        </div>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Users</h3>
          <p className="text-gray-600 mb-6">{error.message || 'Unable to load users'}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
        <p className="text-gray-600">Manage user accounts and roles ({users.length} total users)</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Role Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: `All (${roleCounts.all})`, color: 'btn-outline' },
              { key: 'admin', label: `Admins (${roleCounts.admin})`, color: 'btn-danger' },
              { key: 'agent', label: `Agents (${roleCounts.agent})`, color: 'btn-success' },
              { key: 'user', label: `Users (${roleCounts.user})`, color: 'btn-primary' },
              { key: 'fraud', label: `Fraud (${roleCounts.fraud})`, color: 'btn-warning' }
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setRoleFilter(key)}
                className={`btn btn-sm ${
                  roleFilter === key ? color : 'btn-outline'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.photoURL ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.photoURL}
                              alt={user.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-600 font-medium text-sm">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getRoleBadge(user.role)}`}>
                        {user.role?.charAt(0)?.toUpperCase() + user.role?.slice(1) || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {/* Role Change Buttons */}
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleRoleChange(user._id, 'admin')}
                            className="btn btn-danger btn-sm"
                            disabled={makeAdminMutation.isLoading}
                          >
                            Make Admin
                          </button>
                        )}
                        
                        {user.role !== 'agent' && user.role !== 'fraud' && (
                          <button
                            onClick={() => handleRoleChange(user._id, 'agent')}
                            className="btn btn-success btn-sm"
                            disabled={makeAgentMutation.isLoading}
                          >
                            Make Agent
                          </button>
                        )}
                        
                        {user.role !== 'fraud' && user.role !== 'admin' && (
                          <button
                            onClick={() => handleMarkFraud(user._id)}
                            className="btn btn-warning btn-sm"
                            disabled={markFraudMutation.isLoading}
                          >
                            Mark Fraud
                          </button>
                        )}
                        
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="btn btn-danger btn-sm"
                            disabled={deleteUserMutation.isLoading}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Users Found
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'No users match your search criteria.' : `No ${roleFilter} users found.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
