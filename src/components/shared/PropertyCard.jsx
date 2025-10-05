import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
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
        {property.status && (
          <div className="absolute top-4 right-4">
            {getStatusBadge(property.status)}
          </div>
        )}
        {property.advertised && (
          <div className="absolute top-4 left-4">
            <span className="badge badge-info">Featured</span>
          </div>
        )}
      </div>
      
      <div className="property-card-content">
        <div className="property-price">
          {property.priceRange || 'Price on request'}
        </div>
        
        <h3 className="property-title">{property.title}</h3>
        
        <p className="property-location">
          📍 {property.location}
        </p>
        
        {property.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mt-2">
            {property.description}
          </p>
        )}
        
        <div className="property-meta">
          <div className="profile-section">
            <img 
              src={property.agentImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(property.agentName || 'Agent') + '&background=667eea&color=fff&size=40'} 
              alt={property.agentName || 'Agent'}
              className="profile-image"
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(property.agentName || 'Agent') + '&background=667eea&color=fff&size=40';
              }}
            />
            <span className="profile-name">{property.agentName || 'Unknown Agent'}</span>
          </div>
        </div>
        
        <div className="card-actions">
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