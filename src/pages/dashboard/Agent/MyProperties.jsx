import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import { useState } from 'react';
import toast from '../../../utils/toast';

const MyProperties = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingProperty, setEditingProperty] = useState(null);

  // Fetch agent's properties
  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['agent-properties', user?.email],
    queryFn: async () => {
      const response = await api.get(`/properties/agent/${user.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId) => {
      await api.delete(`/properties/${propertyId}`);
    },
    onSuccess: () => {
      toast.success('Property deleted successfully');
      queryClient.invalidateQueries(['agent-properties']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete property');
    }
  });

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      await deletePropertyMutation.mutateAsync(propertyId);
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

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending Review',
      verified: 'Verified',
      rejected: 'Rejected'
    };
    return texts[status] || status;
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
          <p className="text-gray-600">Loading your properties...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
          <p className="text-gray-600">Error loading properties</p>
        </div>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Properties
          </h3>
          <p className="text-gray-600 mb-6">
            {error.message || 'Unable to load your properties'}
          </p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
          <p className="text-gray-600">Manage your listed properties ({properties.length} total)</p>
        </div>
        <a href="/dashboard/add-property" className="btn btn-primary">
          ➕ Add New Property
        </a>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                {/* Property Image */}
                <div className="md:w-1/3">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                
                {/* Property Details */}
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {property.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        📍 {property.location}
                      </p>
                      <p className="text-lg font-semibold text-green-600 mb-2">
                        {property.priceRange}
                      </p>
                    </div>
                    <span className={`badge ${getStatusBadge(property.status)}`}>
                      {getStatusText(property.status)}
                    </span>
                  </div>

                  {property.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {property.description}
                    </p>
                  )}

                  {/* Property Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p className="font-medium">{getStatusText(property.status)}</p>
                    </div>
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
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setEditingProperty(property)}
                      className="btn btn-secondary btn-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="btn btn-danger btn-sm"
                      disabled={deletePropertyMutation.isLoading}
                    >
                      {deletePropertyMutation.isLoading ? '...' : '🗑️ Delete'}
                    </button>
                    <a
                      href={`/properties/${property._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      👁️ View
                    </a>
                    {property.status === 'verified' && (
                      <button className="btn btn-success btn-sm">
                        📊 Analytics
                      </button>
                    )}
                  </div>

                  {/* Status Messages */}
                  {property.status === 'pending' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        ⏳ Your property is waiting for admin verification. This usually takes 24-48 hours.
                      </p>
                    </div>
                  )}
                  
                  {property.status === 'rejected' && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">
                        ❌ Property was rejected. Please contact support or edit the listing.
                        {property.rejectionReason && (
                          <><br />Reason: {property.rejectionReason}</>
                        )}
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
            No Properties Listed
          </h3>
          <p className="text-gray-600 mb-6">
            You haven't added any properties yet. Start by listing your first property.
          </p>
          <a href="/dashboard/add-property" className="btn btn-primary">
            Add Your First Property
          </a>
        </div>
      )}
    </div>
  );
};

export default MyProperties;