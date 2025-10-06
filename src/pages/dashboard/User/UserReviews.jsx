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
            <div key={review._id} className="dashboard-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Property Review
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{renderStars(review.rating)}</span>
                    <span>({review.rating}/5)</span>
                    <span>•</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {review.comment || review.reviewText || 'No comment provided'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-200 gap-2">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Property:</span> {review.propertyTitle || `Property ID: ${review.propertyId}`}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Reviewed by:</span> {review.reviewerName || review.userName || user?.displayName || 'You'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Share your experience by reviewing properties you've visited or bought
          </p>
          <Link to="/properties" className="btn btn-primary">
            Browse Properties
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserReviews;