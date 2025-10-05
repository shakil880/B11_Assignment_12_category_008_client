import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { useState } from 'react';
import toast from '../../../utils/toast';

const ManageProperties = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // all, pending, verified, rejected
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all properties (admin can see all)
  const { data: allProperties = [], isLoading, error } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const response = await api.get('/properties?admin=true'); // Special admin endpoint
      return response.data;
    },
  });

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
      await api.patch(`/properties/verify/${propertyId}`);
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
      await api.patch(`/properties/reject/${propertyId}`, { reason });
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
        <div className="grid grid-cols-1 gap-6">
          {filteredProperties.map((property) => (
            <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                {/* Property Image */}
                <div className="md:w-1/4">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                
                {/* Property Details */}
                <div className="p-6 md:w-3/4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {property.title}
                      </h3>
                      <p className="text-gray-600 mb-1">📍 {property.location}</p>
                      <p className="text-lg font-semibold text-green-600 mb-1">{property.priceRange}</p>
                      <p className="text-sm text-gray-500">
                        Agent: {property.agentName} ({property.agentEmail})
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${getStatusBadge(property.status)} mb-2`}>
                        {property.status}
                      </span>
                      {property.advertised && (
                        <div className="badge badge-info">Featured</div>
                      )}
                    </div>
                  </div>

                  {property.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {property.description}
                    </p>
                  )}

                  {/* Property Meta */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Listed:</span>
                      <p className="font-medium">
                        {new Date(property.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Views:</span>
                      <p className="font-medium">{property.views || 0}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Inquiries:</span>
                      <p className="font-medium">{property.inquiries || 0}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Agent:</span>
                      <p className="font-medium">{property.agentName}</p>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex flex-wrap gap-2">
                    {property.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleVerify(property._id)}
                          className="btn btn-success btn-sm"
                          disabled={verifyPropertyMutation.isLoading}
                        >
                          ✅ Verify
                        </button>
                        <button
                          onClick={() => handleReject(property._id)}
                          className="btn btn-danger btn-sm"
                          disabled={rejectPropertyMutation.isLoading}
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                    
                    {property.status === 'verified' && !property.advertised && (
                      <button
                        onClick={() => handleAdvertise(property._id)}
                        className="btn btn-info btn-sm"
                        disabled={advertisePropertyMutation.isLoading}
                      >
                        ⭐ Feature
                      </button>
                    )}
                    
                    <a
                      href={`/properties/${property._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      👁️ View
                    </a>
                    
                    <button className="btn btn-secondary btn-sm">
                      📧 Contact Agent
                    </button>
                  </div>

                  {/* Rejection Reason */}
                  {property.status === 'rejected' && property.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">
                        <strong>Rejection Reason:</strong> {property.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
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