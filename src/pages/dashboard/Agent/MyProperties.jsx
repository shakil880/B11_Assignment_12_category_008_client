import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import DashboardPropertyCard from '../../../components/shared/DashboardPropertyCard';
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
      const response = await api.get(`/properties/agent/${user.email}`, {
        headers: { 'user-email': user.email }
      });
      return response.data;
    },
    enabled: !!user?.email,
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId) => {
      await api.delete(`/properties/${propertyId}`, {
        headers: { 'user-email': user.email }
      });
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
      <div className="px-4 sm:px-0">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
          <p className="text-gray-600 text-sm sm:text-base">Loading your properties...</p>
        </div>
        <div className="flex items-center justify-center py-12 sm:py-16">
          <div className="spinner"></div>
          <span className="ml-3 text-sm sm:text-base">Loading properties...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-0">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
          <p className="text-gray-600 text-sm sm:text-base">Error loading properties</p>
        </div>
        <div className="text-center py-12 sm:py-16">
          <div className="text-4xl sm:text-6xl mb-4">😞</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Error Loading Properties
          </h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">
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
    <div className="px-4 sm:px-0">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your listed properties ({properties.length} total)</p>
        </div>
        <a 
          href="/dashboard/add-property" 
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
        >
          <span className="text-lg">➕</span>
          Add New Property
        </a>
      </div>

      {properties.length > 0 ? (
        <div className="dashboard-properties-list">
          {properties.map((property) => (
            <DashboardPropertyCard 
              key={property._id} 
              property={property}
              showActions={true}
              onEdit={setEditingProperty}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <div className="text-4xl sm:text-6xl mb-4">🏠</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No Properties Listed
          </h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">
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