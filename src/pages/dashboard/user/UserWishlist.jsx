import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import DashboardPropertyCard from '../../../components/shared/DashboardPropertyCard';
import { Link } from 'react-router-dom';
import '../../../styles/dashboard.css';

const UserWishlist = () => {
  const { user } = useAuth();

  // Fetch user's wishlist
  const { data: wishlistProperties = [], isLoading, error } = useQuery({
    queryKey: ['wishlist', user?.email],
    queryFn: async () => {
      console.log('Fetching wishlist for user:', user.email);
      
      const response = await api.get(`/wishlist/${user.email}`, {
        headers: { 'user-email': user.email }
      });
      
      console.log('User wishlist response:', response.data);
      return response.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="px-4 sm:px-0">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600 text-sm sm:text-base">Loading your wishlist...</p>
        </div>
        <div className="flex items-center justify-center py-12 sm:py-16">
          <div className="spinner"></div>
          <span className="ml-3 text-sm sm:text-base">Loading wishlist...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-0">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600 text-sm sm:text-base">Error loading wishlist</p>
        </div>
        <div className="text-center py-12 sm:py-16">
          <div className="text-4xl sm:text-6xl mb-4">😞</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Error Loading Wishlist
          </h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">
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
    <div className="px-4 sm:px-0">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600 text-sm sm:text-base">Properties you've saved for later ({wishlistProperties.length} items)</p>
      </div>

      {wishlistProperties.length > 0 ? (
        <div className="dashboard-properties-list">
          {wishlistProperties.map((property) => (
            <DashboardPropertyCard key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <div className="text-4xl sm:text-6xl mb-4">❤️</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Your Wishlist is Empty
          </h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">
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