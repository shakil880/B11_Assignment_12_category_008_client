import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import toast from '../../../utils/toast';

const AddProperty = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    image: '',
    priceRange: { min: '', max: '' },
    description: '',
    agentName: user?.displayName || '',
    agentImage: user?.photoURL || '',
    agentEmail: user?.email || ''
  });

  const addPropertyMutation = useMutation({
    mutationFn: async (propertyData) => {
      const response = await api.post('/properties', propertyData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Property added successfully! It will appear in All Properties with "pending" status. Redirecting you there...');
      // Invalidate all property-related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property'] });
      queryClient.invalidateQueries({ queryKey: ['user-properties'] });
      
      // Reset form
      setFormData({
        title: '',
        location: '',
        image: '',
        priceRange: { min: '', max: '' },
        description: '',
        agentName: user?.displayName || '',
        agentImage: user?.photoURL || '',
        agentEmail: user?.email || ''
      });
      
      // Redirect to All Properties page after a short delay
      setTimeout(() => {
        navigate('/properties');
      }, 1500);
    },
    onError: (error) => {
      console.error('Add property error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      const errorMessage = error.response?.data?.message || error.response?.data?.details || error.message || 'Failed to add property';
      toast.error(`Error: ${errorMessage}`);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.title || !formData.location || !formData.image || !formData.priceRange.min || !formData.priceRange.max) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (parseInt(formData.priceRange.min) >= parseInt(formData.priceRange.max)) {
        toast.error('Maximum price must be greater than minimum price');
        return;
      }

      const propertyData = {
        ...formData,
        priceRange: `$${formData.priceRange.min} - $${formData.priceRange.max}`,
        status: 'pending', // Will be verified by admin
        agentEmail: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('Submitting property data:', propertyData);
      
      await addPropertyMutation.mutateAsync(propertyData);
    } catch (error) {
      console.error('Error adding property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('priceRange.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Property</h1>
        <p className="text-gray-600">List a new property for sale</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Modern Family Home with Garden"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Downtown, City Name"
                required
              />
            </div>

            {/* Property Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Image URL *
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/property-image.jpg"
                required
              />
              
              {/* Image Preview */}
              {formData.image && (
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Preview
                  </label>
                  <div className="max-w-sm">
                    <img
                      src={formData.image}
                      alt="Property preview"
                      className="rounded-lg border border-gray-300 shadow-sm"
                      style={{ width: '320px', height: 'auto' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Price ($) *
              </label>
              <input
                type="number"
                name="priceRange.min"
                value={formData.priceRange.min}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100000"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Price ($) *
              </label>
              <input
                type="number"
                name="priceRange.max"
                value={formData.priceRange.max}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="500000"
                min="0"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the property features, amenities, and highlights..."
              />
            </div>

            {/* Agent Information (Auto-filled) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Name
              </label>
              <input
                type="text"
                value={formData.agentName}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Email
              </label>
              <input
                type="email"
                value={formData.agentEmail}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                disabled
              />
            </div>
          </div>



          {/* Submit Button */}
          <div className="flex justify-center md:justify-start pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading || addPropertyMutation.isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {isLoading || addPropertyMutation.isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Property...
                </>
              ) : (
                <>
                  <span>➕</span>
                  Add Property
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="text-blue-500 text-lg">ℹ️</div>
          <div>
            <h3 className="text-blue-800 font-medium text-sm mb-1">Property Verification</h3>
            <p className="text-blue-700 text-xs">
              Your property will be reviewed by an admin before being listed publicly. You'll receive notifications about status updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;