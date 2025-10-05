import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

const SoldProperties = () => {
  const { user } = useAuth();

  // Fetch agent's sold properties
  const { data: soldProperties = [], isLoading, error } = useQuery({
    queryKey: ['sold-properties', user?.email],
    queryFn: async () => {
      const response = await api.get(`/properties/sold/${user.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  // Calculate total earnings
  const totalEarnings = soldProperties.reduce((sum, property) => {
    const price = property.soldPrice || 0;
    return sum + price;
  }, 0);

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sold Properties</h1>
          <p className="text-gray-600">Loading sold properties...</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="spinner"></div>
          <span className="ml-3">Loading sold properties...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sold Properties</h1>
          <p className="text-gray-600">Error loading sold properties</p>
        </div>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Sold Properties
          </h3>
          <p className="text-gray-600 mb-6">
            {error.message || 'Unable to load your sold properties'}
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sold Properties</h1>
        <p className="text-gray-600">Track your successful property sales ({soldProperties.length} sold)</p>
      </div>

      {/* Stats Cards */}
      {soldProperties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🏠</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Properties Sold</h3>
                <p className="text-2xl font-bold text-green-600">{soldProperties.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">💰</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Earnings</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📈</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Average Sale</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${soldProperties.length > 0 ? Math.round(totalEarnings / soldProperties.length).toLocaleString() : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sold Properties List */}
      {soldProperties.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {soldProperties.map((property) => (
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
                      <p className="text-sm text-gray-500 mb-2">
                        Listed: {property.priceRange}
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        Sold: ${property.soldPrice?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <span className="badge badge-success">
                      ✅ Sold
                    </span>
                  </div>

                  {/* Sale Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Buyer:</span>
                      <p className="font-medium">{property.buyer?.name || 'Private'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Sale Date:</span>
                      <p className="font-medium">
                        {property.soldDate ? new Date(property.soldDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Commission:</span>
                      <p className="font-medium text-green-600">
                        ${property.commission?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Sale Performance */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Sale Performance:</span>
                      <span className="text-sm font-medium">
                        {property.soldPrice && property.originalPrice 
                          ? `${((property.soldPrice / property.originalPrice) * 100).toFixed(1)}% of asking`
                          : 'N/A'
                        }
                      </span>
                    </div>
                    {property.soldPrice && property.originalPrice && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min((property.soldPrice / property.originalPrice) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn-outline btn-sm">
                      📄 View Contract
                    </button>
                    <button className="btn btn-secondary btn-sm">
                      📧 Contact Buyer
                    </button>
                    <button className="btn btn-info btn-sm">
                      📈 Sale Analytics
                    </button>
                  </div>

                  {/* Transaction Details */}
                  {property.transactionId && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">
                        <strong>Transaction ID:</strong> {property.transactionId}
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
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Properties Sold Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Keep working on your listings! Your first sale will appear here.
          </p>
          <a href="/dashboard/my-properties" className="btn btn-primary">
            View My Properties
          </a>
        </div>
      )}
    </div>
  );
};

export default SoldProperties;