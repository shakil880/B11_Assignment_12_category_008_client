import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from '../utils/toast';

const AddPropertyPublic = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    image: '',
    priceRange: { min: '', max: '' },
    description: '',
    agentName: '',
    agentEmail: ''
  });

  const addPropertyMutation = useMutation({
    mutationFn: async (propertyData) => {
      const response = await api.post('/properties', propertyData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Property added successfully! Admin will verify it soon.');
      queryClient.invalidateQueries(['properties']);
      // Reset form
      setFormData({
        title: '',
        location: '',
        image: '',
        priceRange: { min: '', max: '' },
        description: '',
        agentName: '',
        agentEmail: ''
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add property');
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

      if (!formData.agentEmail.includes('@')) {
        toast.error('Please enter a valid email address');
        return;
      }

      await addPropertyMutation.mutateAsync({
        ...formData,
        priceRange: `$${parseInt(formData.priceRange.min).toLocaleString()} - $${parseInt(formData.priceRange.max).toLocaleString()}`,
        status: 'pending', // Will be verified by admin
        createdAt: new Date(),
        updatedAt: new Date()
      });
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
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Property</h1>
          <p className="text-gray-600">List your property for sale - no account required!</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
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
                  placeholder="e.g., Downtown, New York"
                  required
                />
              </div>

              {/* Property Image URL */}
              <div>
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

              {/* Agent Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent Name *
                </label>
                <input
                  type="text"
                  name="agentName"
                  value={formData.agentName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent Email *
                </label>
                <input
                  type="email"
                  name="agentEmail"
                  value={formData.agentEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
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
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Preview
                </label>
                <img
                  src={formData.image}
                  alt="Property preview"
                  className="w-full h-64 object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                disabled={isLoading || addPropertyMutation.isLoading}
                className="btn btn-primary px-8 py-3"
              >
                {isLoading || addPropertyMutation.isLoading ? (
                  <>
                    <div className="spinner inline-block mr-2"></div>
                    Adding Property...
                  </>
                ) : (
                  'Add Property'
                )}
              </button>
              
              <a href="/properties" className="btn btn-outline px-8 py-3">
                Back to Properties
              </a>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-blue-500 text-xl mr-3">ℹ️</div>
            <div>
              <h3 className="text-blue-800 font-semibold mb-1">Property Verification</h3>
              <p className="text-blue-700 text-sm">
                Your property will be reviewed by an admin before being listed publicly. 
                This usually takes 24-48 hours. You can check the status on our properties page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyPublic;