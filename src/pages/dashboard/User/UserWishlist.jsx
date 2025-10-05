import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import PropertyCard from '../../../components/shared/PropertyCard';
import { Link } from 'react-router-dom';

const UserWishlist = () => {
  const { user } = useAuth();

  // Fetch user's wishlist
  const { data: wishlistProperties = [], isLoading, error } = useQuery({
    queryKey: ['wishlist', user?.email],
    queryFn: async () => {
      const response = await api.get(`/wishlist/${user.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="spinner"></div>
          <span className="ml-3">Loading wishlist...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">Error loading wishlist</p>
        </div>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Wishlist
          </h3>
          <p className="text-gray-600 mb-6">
            {error.message || 'Unable to load your wishlist'}
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">Properties you've saved for later ({wishlistProperties.length} items)</p>
      </div>

      {wishlistProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Your Wishlist is Empty
          </h3>
          <p className="text-gray-600 mb-6">
            Start adding properties to your wishlist to keep track of your favorites
          </p>
          <Link to="/properties" className="btn btn-primary">
            Browse Properties
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserWishlist;