import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
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

  const getStatusBadge = (status) => {
    const statusClasses = {
      verified: 'badge-success',
      pending: 'badge-warning',
      rejected: 'badge-danger'
    };

    return (
      <span className={`badge ${statusClasses[status] || 'badge-warning'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="property-card">
      <div className="relative">
        <img 
          src={property.image || '/placeholder-property.jpg'} 
          alt={property.title}
          className="property-card-image"
        />
        <div className="absolute top-4 right-4">
          {getStatusBadge(property.verificationStatus)}
        </div>
      </div>
      
      <div className="property-card-content">
        <div className="property-price">
          {formatPrice(property.priceRange.min, property.priceRange.max)}
        </div>
        
        <h3 className="property-title">{property.title}</h3>
        
        <p className="property-location">
          📍 {property.location}
        </p>
        
        <div className="property-meta">
          <div className="flex items-center gap-2">
            <img 
              src={property.agent.image || '/default-avatar.png'} 
              alt={property.agent.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="property-meta-item">{property.agent.name}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 mt-6">
          <Link 
            to={`/properties/${property._id}`}
            className="btn btn-primary w-full"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;