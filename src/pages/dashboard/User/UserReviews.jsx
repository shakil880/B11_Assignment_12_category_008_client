import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import { Link } from 'react-router-dom';

const UserReviews = () => {
  const { user } = useAuth();

  // Temporarily show empty reviews
  const reviews = [];
  const isLoading = false;
  const error = null;

  // TODO: Re-enable API call
  /*
  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['user-reviews', user?.email],
    queryFn: async () => {
      const response = await api.get(`/reviews/user/${user.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });
  */

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

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
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Property ID: {review.propertyId}
                </div>
                <div className="text-sm text-gray-500">
                  {review.reviewerName || user?.displayName || 'Anonymous'}
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