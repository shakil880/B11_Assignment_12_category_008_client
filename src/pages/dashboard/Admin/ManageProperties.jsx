import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import { useState } from 'react';
import toast from '../../../utils/toast';

const ManageProperties = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // all, pending, verified, rejected
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all properties (admin can see all)
  const { data: propertyData, isLoading, error } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const response = await api.get('/properties?admin=true', {
        headers: { 'user-email': user?.email }
      });
      return response.data;
    },
    enabled: !!user?.email,
  });

  const allProperties = propertyData?.properties || [];

  // Filter properties based on status and search
  const filteredProperties = allProperties.filter(property => {
    const matchesFilter = filter === 'all' || property.status === filter;
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.agentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Verify property mutation
  const verifyPropertyMutation = useMutation({
    mutationFn: async (propertyId) => {
      await api.patch(`/properties/verify/${propertyId}`, {}, {
        headers: { 'user-email': user?.email }
      });
    },
    onSuccess: () => {
      toast.success('Property verified successfully');
      queryClient.invalidateQueries(['admin-properties']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to verify property');
    }
  });

  // Reject property mutation
  const rejectPropertyMutation = useMutation({
    mutationFn: async ({ propertyId, reason }) => {
      await api.patch(`/properties/reject/${propertyId}`, { reason }, {
        headers: { 'user-email': user?.email }
      });
    },
    onSuccess: () => {
      toast.success('Property rejected');
      queryClient.invalidateQueries(['admin-properties']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject property');
    }
  });

  // Advertise property mutation
  const advertisePropertyMutation = useMutation({
    mutationFn: async (propertyId) => {
      await api.patch(`/properties/advertise/${propertyId}`);
    },
    onSuccess: () => {
      toast.success('Property marked as advertised');
      queryClient.invalidateQueries(['admin-properties']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to advertise property');
    }
  });

  const handleVerify = async (propertyId) => {
    await verifyPropertyMutation.mutateAsync(propertyId);
  };

  const handleReject = async (propertyId) => {
    const reason = prompt('Enter rejection reason (optional):');
    await rejectPropertyMutation.mutateAsync({ propertyId, reason: reason || 'No reason provided' });
  };

  const handleAdvertise = async (propertyId) => {
    if (window.confirm('Mark this property as advertised/featured?')) {
      await advertisePropertyMutation.mutateAsync(propertyId);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      verified: 'badge-success',
      rejected: 'badge-danger'
    };
    return badges[status] || 'badge-secondary';
  };

  const getStatusCounts = () => {
    return {
      all: allProperties.length,
      pending: allProperties.filter(p => p.status === 'pending').length,
      verified: allProperties.filter(p => p.status === 'verified').length,
      rejected: allProperties.filter(p => p.status === 'rejected').length
    };
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Properties</h1>
          <p className="text-gray-600">Loading properties...</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="spinner"></div>
          <span className="ml-3">Loading properties...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Properties</h1>
          <p className="text-gray-600">Error loading properties</p>
        </div>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Properties</h3>
          <p className="text-gray-600 mb-6">{error.message || 'Unable to load properties'}</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Properties</h1>
        <p className="text-gray-600">Review and manage all property listings</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: `All (${statusCounts.all})`, color: 'btn-outline' },
              { key: 'pending', label: `Pending (${statusCounts.pending})`, color: 'btn-warning' },
              { key: 'verified', label: `Verified (${statusCounts.verified})`, color: 'btn-success' },
              { key: 'rejected', label: `Rejected (${statusCounts.rejected})`, color: 'btn-danger' }
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`btn btn-sm ${
                  filter === key ? color : 'btn-outline'
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
              placeholder="Search by title, location, or agent email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Properties List */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden" style={{ width: '320px', maxWidth: '320px', height: 'auto' }}>
              {/* Property Image */}
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-40 object-cover"
                  style={{ height: '160px', maxHeight: '160px' }}
                />
                {/* Status Badge */}
                <div className="absolute top-1 right-1">
                  <span className={`badge badge-xs ${getStatusBadge(property.status)}`}>
                    {property.status}
                  </span>
                  {property.advertised && (
                    <div className="badge badge-info badge-xs ml-1">★</div>
                  )}
                </div>
              </div>
              
              {/* Property Details */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                  {property.title}
                </h3>
                <p className="text-gray-600 mb-1 text-xs">📍 {property.location}</p>
                <p className="text-sm font-semibold text-green-600 mb-2">{property.priceRange}</p>
                
                {/* Property Meta - Ultra Compact */}
                <div className="text-xs text-gray-500 mb-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Views: {property.views || 0}</span>
                    <span>Inquiries: {property.inquiries || 0}</span>
                  </div>
                  <div className="truncate">Agent: {property.agentName}</div>
                </div>

                {/* Admin Actions - Ultra Compact */}
                <div className="flex gap-1">
                  {property.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleVerify(property._id)}
                        className="btn btn-success btn-xs px-2 py-1 text-xs flex-1"
                        disabled={verifyPropertyMutation.isLoading}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleReject(property._id)}
                        className="btn btn-danger btn-xs px-2 py-1 text-xs flex-1"
                        disabled={rejectPropertyMutation.isLoading}
                      >
                        ✗
                      </button>
                    </>
                  )}
                  
                  {property.status === 'verified' && !property.advertised && (
                    <button
                      onClick={() => handleAdvertise(property._id)}
                      className="btn btn-info btn-xs px-2 py-1 text-xs flex-1"
                      disabled={advertisePropertyMutation.isLoading}
                    >
                      ★
                    </button>
                  )}
                  
                  <a
                    href={`/properties/${property._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-xs px-2 py-1 text-xs flex-1"
                  >
                    👁
                  </a>
                </div>

                {/* Rejection Reason */}
                {property.status === 'rejected' && property.rejectionReason && (
                  <div className="mt-2 p-1 bg-red-50 border border-red-200 rounded text-xs">
                    <p className="text-red-800 truncate">
                      <strong>Rejected:</strong> {property.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Properties Found
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'No properties match your search criteria.' : `No ${filter} properties found.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageProperties;