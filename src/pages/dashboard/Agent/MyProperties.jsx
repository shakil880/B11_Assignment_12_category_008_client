import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import { useState } from 'react';
import toast from '../../../utils/toast';
import '../../../styles/dashboard.css';

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
        <a 
          href="/dashboard/add-property" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <span className="text-lg">➕</span>
          Add New Property
        </a>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {properties.map((property) => (
            <div key={property._id} className="property-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-sm">
              {/* Property Image */}
              <div className="relative h-32 w-full">
                <img
                  src={property.image}
                  alt={property.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`badge ${getStatusBadge(property.status)} text-xs px-2 py-1`}>
                    {getStatusText(property.status)}
                  </span>
                </div>
              </div>
              
              {/* Property Details */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                  {property.title}
                </h3>
                <p className="text-gray-600 mb-2 text-sm">
                  📍 {property.location}
                </p>
                <p className="text-base font-semibold text-green-600 mb-3">
                  {property.priceRange}
                </p>

                {/* Simple stats */}
                <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
                  <span>Views: {property.views || 0}</span>
                  <span>{new Date(property.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProperty(property)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium py-2 px-3 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium py-2 px-3 rounded transition-colors"
                    disabled={deletePropertyMutation.isLoading}
                  >
                    {deletePropertyMutation.isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                  <a
                    href={`/properties/${property._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium py-2 px-3 rounded transition-colors text-center"
                  >
                    View
                  </a>
                </div>

                {/* Status Messages */}
                {property.status === 'pending' && (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    <p className="text-yellow-800">
                      ⏳ Awaiting verification (24-48 hours)
                    </p>
                  </div>
                )}
                
                {property.status === 'rejected' && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                    <p className="text-red-800">
                      ❌ Property rejected
                      {property.rejectionReason && (
                        <><br />Reason: {property.rejectionReason}</>
                      )}
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