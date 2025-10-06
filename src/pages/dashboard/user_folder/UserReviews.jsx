import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import { Link } from 'react-router-dom';

const UserReviews = () => {
  const { user } = useAuth();

  // Fetch user's reviews
  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['user-reviews', user?.email],
    queryFn: async () => {
      console.log('Fetching reviews for user:', user.email);
      
      const response = await api.get(`/reviews/user/${user.email}`, {
        headers: { 'user-email': user.email }
      });
      
      console.log('User reviews response:', response.data);
      return response.data;
    },
    enabled: !!user?.email,
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <p className="text-gray-600">Loading your reviews...</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading reviews...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <p className="text-gray-600">Error loading reviews</p>
        </div>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Reviews
          </h3>
          <p className="text-gray-600 mb-6">
            {error.message || 'Unable to load your reviews'}
          </p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
        <p className="text-gray-600">Reviews you've written for properties ({reviews.length} reviews)</p>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 border border-purple-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    ⭐
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      Your Property Review
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                      <span className="flex text-yellow-400">{renderStars(review.rating)}</span>
                      <span className="font-medium">({review.rating}/5)</span>
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-purple-600 bg-purple-100 px-3 py-1 rounded-full font-medium">
                  {review.rating === 1 && "Poor"}
                  {review.rating === 2 && "Fair"}
                  {review.rating === 3 && "Good"}
                  {review.rating === 4 && "Very Good"}
                  {review.rating === 5 && "Excellent"}
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border-l-4 border-purple-300">
                  "{review.comment || review.reviewText || 'No comment provided'}"
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-purple-200 gap-2">
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <span>🏠</span>
                  <span className="font-medium">Property:</span> 
                  <span className="text-purple-600">{review.propertyTitle || `Property ID: ${review.propertyId}`}</span>
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <span>👤</span>
                  <span className="font-medium">Reviewed by:</span> 
                  <span className="text-purple-600">{review.reviewerName || review.userName || user?.displayName || 'You'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-dashed border-purple-200">
          <div className="text-7xl mb-6">🌟</div>
          <h3 className="text-2xl font-bold text-purple-800 mb-3">
            No Reviews Yet
          </h3>
          <p className="text-purple-600 mb-8 max-w-md mx-auto text-lg">
            Share your experience by reviewing properties you've visited or are interested in!
          </p>
          <Link 
            to="/properties" 
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
          >
            <span>🏠</span>
            Browse Properties
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserReviews;