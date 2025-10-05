import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const PropertyDetails = () => {
  const { id } = useParams();

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-96 rounded-lg mb-8"></div>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="bg-gray-300 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Property Not Found
          </h2>
          <p className="text-gray-600">
            The property you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const formatPrice = (min, max) => {
    const formatNumber = (num) => {
      if (num >= 1000000) {
        return `$${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `$${(num / 1000).toFixed(0)}K`;
      }
      return `$${num.toLocaleString()}`;
    };

    if (min === max) return formatNumber(min);
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  return (
    <div className="property-details-container">
      {/* Property Hero */}
      <div className="property-hero">
        <img
          src={property.image || '/placeholder-property.jpg'}
          alt={property.title}
          className="property-hero-image"
        />
      </div>

      {/* Property Info */}
      <div className="property-info">
        <div className="property-main-info">
          <h1>{property.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="property-price">
              {formatPrice(property.priceRange.min, property.priceRange.max)}
            </div>
            <span className={`badge ${
              property.verificationStatus === 'verified' ? 'badge-success' :
              property.verificationStatus === 'pending' ? 'badge-warning' : 'badge-danger'
            }`}>
              {property.verificationStatus}
            </span>
          </div>

          <p className="property-location mb-6">
            📍 {property.location}
          </p>

          <div className="property-description">
            <h3>Description</h3>
            <p>{property.description || 'No description available for this property.'}</p>
          </div>

          <div className="property-features">
            <div className="feature-item">
              <span>🏠</span>
              <span>Property Type: {property.type || 'Residential'}</span>
            </div>
            <div className="feature-item">
              <span>📏</span>
              <span>Area: {property.area || 'Not specified'}</span>
            </div>
            <div className="feature-item">
              <span>🛏️</span>
              <span>Bedrooms: {property.bedrooms || 'Not specified'}</span>
            </div>
            <div className="feature-item">
              <span>🚿</span>
              <span>Bathrooms: {property.bathrooms || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Property Sidebar */}
        <div className="property-sidebar">
          <div className="agent-info">
            <img
              src={property.agent.image || '/default-avatar.png'}
              alt={property.agent.name}
              className="agent-avatar"
            />
            <div className="agent-details">
              <h3>{property.agent.name}</h3>
              <p>{property.agent.email}</p>
            </div>
          </div>

          <button className="btn btn-primary w-full mb-3">
            Add to Wishlist
          </button>
          <button className="btn btn-outline w-full">
            Contact Agent
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="flex justify-between items-center mb-6">
          <h2>Property Reviews</h2>
          <button className="btn btn-primary">
            Add Review
          </button>
        </div>

        <div className="text-center py-8">
          <p className="text-gray-600">No reviews yet. Be the first to review this property!</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;