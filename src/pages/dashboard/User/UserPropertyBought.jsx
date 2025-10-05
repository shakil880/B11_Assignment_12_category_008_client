import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import { Link } from 'react-router-dom';

const UserPropertyBought = () => {
  const { user } = useAuth();

  // Temporarily show empty offers
  const offers = [];
  const isLoading = false;
  const error = null;

  // TODO: Re-enable API call
  /*
  const { data: offers = [], isLoading, error } = useQuery({
    queryKey: ['user-offers', user?.email],
    queryFn: async () => {
      const response = await api.get(`/offers/user/${user.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });
  */

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge badge-warning',
      accepted: 'badge badge-success',
      rejected: 'badge badge-danger',
      bought: 'badge badge-primary'
    };
    return statusClasses[status] || 'badge badge-secondary';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Offers</h1>
        <p className="text-gray-600">Track your property offers and purchases ({offers.length} offers)</p>
      </div>

      {offers.length > 0 ? (
        <div className="space-y-4">
          {offers.map((offer) => (
            <div key={offer._id} className="dashboard-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {offer.propertyTitle || 'Property Offer'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Offered: ${offer.offeredAmount?.toLocaleString()} | 
                    Agent: {offer.agentEmail}
                  </p>
                </div>
                <span className={getStatusBadge(offer.status)}>
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Property ID:</span>
                  <p className="font-medium">{offer.propertyId}</p>
                </div>
                <div>
                  <span className="text-gray-500">Offer Date:</span>
                  <p className="font-medium">
                    {new Date(offer.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {offer.status === 'bought' && offer.transactionId && (
                  <div>
                    <span className="text-gray-500">Transaction ID:</span>
                    <p className="font-medium">{offer.transactionId}</p>
                  </div>
                )}
                {offer.paymentDate && (
                  <div>
                    <span className="text-gray-500">Payment Date:</span>
                    <p className="font-medium">
                      {new Date(offer.paymentDate).toLocaleDateString()}
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
            No Property Offers Yet
          </h3>
          <p className="text-gray-600 mb-6">
            When you make offers on properties, they'll appear here
          </p>
          <Link to="/properties" className="btn btn-primary">
            Browse Properties
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserPropertyBought;