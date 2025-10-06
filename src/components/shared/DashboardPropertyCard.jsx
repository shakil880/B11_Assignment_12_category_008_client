import { Link } from 'react-router-dom';

const DashboardPropertyCard = ({ property, showActions = false, onEdit, onDelete }) => {
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
    <div className="dashboard-property-card">
      {/* Property Image */}
      <div className="dashboard-property-image">
        <img 
          src={property.image || '/placeholder-property.jpg'} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {property.advertised && (
          <div className="absolute top-2 left-2">
            <span className="badge badge-info text-xs">Featured</span>
          </div>
        )}
      </div>
      
      {/* Property Details */}
      <div className="dashboard-property-details">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="dashboard-property-title">{property.title}</h3>
            <p className="dashboard-property-location">
              📍 {property.location}
            </p>
          </div>
          <div className="text-right">
            <div className="dashboard-property-price">
              {property.priceRange || 'Price on request'}
            </div>
            {property.status && getStatusBadge(property.status)}
          </div>
        </div>
        
        {property.description && (
          <p className="dashboard-property-description">
            {property.description}
          </p>
        )}
        
        <div className="dashboard-property-features">
          {property.bedrooms && (
            <span className="feature-item">🛏️ {property.bedrooms} bed</span>
          )}
          {property.bathrooms && (
            <span className="feature-item">🚿 {property.bathrooms} bath</span>
          )}
          {property.area && (
            <span className="feature-item">📐 {property.area}</span>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="dashboard-property-actions">
        <Link 
          to={`/properties/${property._id}`}
          className="btn btn-outline btn-sm"
        >
          View Details
        </Link>
        
        {showActions && (
          <>
            <button 
              onClick={() => onEdit && onEdit(property)}
              className="btn btn-secondary btn-sm"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete && onDelete(property._id)}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPropertyCard;