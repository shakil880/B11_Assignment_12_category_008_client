import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import toast from '../utils/toast';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Debug logging for user state
  console.log('PropertyDetails component loaded:', {
    propertyId: id,
    user: user,
    userEmail: user?.email,
    userAuthenticated: !!user
  });

  // Test API connectivity on load
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        console.log('Testing API connection...');
        const response = await api.get('/health');
        console.log('API Health Check successful:', response.data);
      } catch (error) {
        console.error('API Health Check failed:', error);
      }
    };
    
    testApiConnection();
  }, []);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    },
  });

  // Check if property is in user's wishlist
  const { data: wishlistStatus, refetch: refetchWishlistStatus } = useQuery({
    queryKey: ['wishlist-status', id, user?.email],
    queryFn: async () => {
      if (!user?.email || !id) return false;
      try {
        const response = await api.get(`/wishlist/${user.email}`, {
          headers: { 'user-email': user.email }
        });
        return response.data.some(item => item.propertyId === id || item._id === id);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
        return false;
      }
    },
    enabled: !!user?.email && !!id,
  });

  // Fetch property reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['property-reviews', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/reviews/property/${id}`);
        return response.data || [];
      } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }
    },
    enabled: !!id,
  });

  // Wishlist mutations
  const wishlistMutation = useMutation({
    mutationFn: async ({ action }) => {
      console.log('Wishlist mutation starting...', { 
        action, 
        user: user?.email, 
        propertyId: id, 
        apiBaseURL: api.defaults.baseURL 
      });
      
      if (!user?.email) throw new Error('Please login first');
      
      try {
        if (action === 'add') {
          const wishlistPayload = {
            propertyId: id,
            userEmail: user.email,
            createdAt: new Date().toISOString()
          };
          
          console.log('Adding to wishlist - payload:', wishlistPayload);
          console.log('Request URL:', `${api.defaults.baseURL}/wishlist`);
          console.log('Request headers:', { 'user-email': user.email });
          
          const response = await api.post('/wishlist', wishlistPayload, {
            headers: { 'user-email': user.email }
          });
          
          console.log('Add to wishlist - Response:', response);
          return response.data;
        } else {
          console.log('Removing from wishlist:', { userEmail: user.email, propertyId: id });
          console.log('Request URL:', `${api.defaults.baseURL}/wishlist/${user.email}/${id}`);
          
          const response = await api.delete(`/wishlist/${user.email}/${id}`, {
            headers: { 'user-email': user.email }
          });
          
          console.log('Remove from wishlist - Response:', response);
          return response.data;
        }
      } catch (error) {
        console.error('API Request failed:', {
          message: error.message,
          code: error.code,
          response: error.response,
          request: error.request,
          config: error.config
        });
        throw error;
      }
    },
    onSuccess: (data, { action }) => {
      console.log('Wishlist operation successful:', data);
      toast.success(action === 'add' ? '❤️ Added to wishlist!' : '💔 Removed from wishlist!');
      refetchWishlistStatus();
      queryClient.invalidateQueries(['wishlist']);
      queryClient.invalidateQueries(['wishlist-status']);
    },
    onError: (error) => {
      console.error('Wishlist error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    }
  });

  // Review mutation
  const reviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      console.log('Review mutation starting...', { 
        reviewData, 
        user: user?.email, 
        propertyId: id 
      });
      
      if (!user?.email) throw new Error('Please login first');
      
      try {
        const reviewPayload = {
          propertyId: id,
          userEmail: user.email,
          reviewerEmail: user.email, // Add reviewerEmail for server compatibility
          userName: user.displayName || user.email,
          reviewerName: user.displayName || user.email,
          rating: reviewData.rating,
          comment: reviewData.comment,
          createdAt: new Date().toISOString()
        };
        
        console.log('Sending review payload:', reviewPayload);
        console.log('Request URL:', `${api.defaults.baseURL}/reviews`);
        
        const response = await api.post('/reviews', reviewPayload, {
          headers: { 'user-email': user.email }
        });
        
        console.log('Review API Response:', response);
        return response.data;
      } catch (error) {
        console.error('Review API Request failed:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Review added successfully:', data);
      toast.success('⭐ Review added successfully!');
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: '' });
      queryClient.invalidateQueries(['property-reviews']);
      queryClient.invalidateQueries(['user-reviews']);
    },
    onError: (error) => {
      console.error('Review error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to add review');
    }
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="loading-container">
          <LoadingSpinner 
            size="large" 
            message="Loading Property Details..." 
          />
          {/* Faded skeleton for visual feedback */}
          <div className="animate-pulse mt-8 opacity-30">
            <div className="bg-gray-300 h-96 rounded-lg mb-8"></div>
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="bg-gray-300 h-64 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Property Not Found
          </h2>
          <p className="text-gray-600">
            The property you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

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

  const handleWishlist = async () => {
    console.log('handleWishlist called - User state:', { 
      user: user, 
      userEmail: user?.email, 
      userUID: user?.uid,
      userDisplayName: user?.displayName
    });
    
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    
    if (!user.email) {
      toast.error('User email not available. Please try logging in again.');
      return;
    }
    
    console.log('Wishlist action:', { user: user.email, property: id, currentStatus: wishlistStatus });
    wishlistMutation.mutate({ action: wishlistStatus ? 'remove' : 'add' });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add a review');
      navigate('/login');
      return;
    }
    if (!reviewData.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    
    console.log('Submitting review:', { user: user.email, property: id, reviewData });
    reviewMutation.mutate(reviewData);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm border transition-all duration-200 mb-6"
        >
          <span className="text-lg">←</span>
          Back to Properties
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Image */}
            <div className="relative mb-2">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto border border-gray-100">
                <div className="relative group">
                  <img 
                    src={property.image || '/placeholder-property.jpg'} 
                    alt={property.title}
                    className="w-full h-64 sm:h-72 lg:h-80 xl:h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                {property.status && (
                  <div className="absolute top-6 right-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border ${
                      property.status === 'verified' 
                        ? 'bg-green-500/90 text-white border-green-400' :
                      property.status === 'pending' 
                        ? 'bg-yellow-500/90 text-white border-yellow-400' :
                        'bg-red-500/90 text-white border-red-400'
                    }`}>
                      {property.status.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent h-20 pointer-events-none"></div>
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{property.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <p className="text-gray-600 flex items-center gap-1">
                    <span className="text-blue-500">📍</span> 
                    {property.location}
                  </p>
                  <div className="text-xl md:text-2xl font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                    {property.priceRange || 'Price on request'}
                  </div>
                </div>
              </div>

              {property.description && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800">About this property</h2>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🏠</div>
                  <div className="text-xs text-gray-600 mb-1">Type</div>
                  <div className="font-semibold text-sm">{property.type || 'Residential'}</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">📐</div>
                  <div className="text-xs text-gray-600 mb-1">Area</div>
                  <div className="font-semibold text-sm">{property.area || 'N/A'}</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🛏️</div>
                  <div className="text-xs text-gray-600 mb-1">Bedrooms</div>
                  <div className="font-semibold text-sm">{property.bedrooms || 'N/A'}</div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🚿</div>
                  <div className="text-xs text-gray-600 mb-1">Bathrooms</div>
                  <div className="font-semibold text-sm">{property.bathrooms || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Reviews Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <span>🌟</span>
                      Reviews & Ratings
                    </h2>
                    {reviews.length > 0 ? (
                      <div className="flex items-center gap-3">
                        <div className="flex text-yellow-300 text-lg">{renderStars(Math.round(averageRating))}</div>
                        <span className="text-purple-100 font-medium">
                          {averageRating} out of 5 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                    ) : (
                      <p className="text-purple-100">No reviews yet - be the first to share your experience!</p>
                    )}
                  </div>
                  {user && (
                    <button 
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 border-2 border-transparent hover:border-purple-200"
                    >
                      <span>✍️</span>
                      {showReviewForm ? 'Cancel Review' : 'Write Review'}
                    </button>
                  )}
                </div>
              </div>

              {/* Reviews Content */}
              <div className="p-6">
                {/* Review Form */}
                {showReviewForm && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-6 border border-purple-100">
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div>
                      <label className="block text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                        <span>⭐</span>
                        Rate this Property
                      </label>
                      <div className="flex gap-2 justify-center p-4 bg-white rounded-lg shadow-sm">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                            className="text-4xl focus:outline-none hover:scale-125 transition-all duration-200 focus:ring-2 focus:ring-purple-300 rounded-full p-1"
                          >
                            <span className={star <= reviewData.rating ? 'text-yellow-400 drop-shadow-lg' : 'text-gray-300 hover:text-yellow-200'}>
                              ⭐
                            </span>
                          </button>
                        ))}
                      </div>
                      <p className="text-center text-purple-600 font-medium mt-2">
                        {reviewData.rating === 1 && "Poor"}
                        {reviewData.rating === 2 && "Fair"}
                        {reviewData.rating === 3 && "Good"}
                        {reviewData.rating === 4 && "Very Good"}
                        {reviewData.rating === 5 && "Excellent"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
                        <span>💭</span>
                        Share Your Experience
                      </label>
                      <textarea
                        value={reviewData.comment}
                        onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                        className="w-full px-4 py-4 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none shadow-sm"
                        rows={5}
                        placeholder="Tell others about your experience with this property. What did you like? What could be improved?"
                        required
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={reviewMutation.isLoading}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 flex-1"
                      >
                        {reviewMutation.isLoading ? (
                          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Publishing Review... </>
                        ) : (
                          <><span>�</span> Publish Review</>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold transition-colors border border-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="bg-gradient-to-r from-white to-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                              {(review.userName || 'A').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{review.userName || 'Anonymous'}</div>
                              <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">{renderStars(review.rating)}</div>
                                <span className="text-sm text-purple-600 font-medium">
                                  {review.rating === 1 && "Poor"}
                                  {review.rating === 2 && "Fair"}
                                  {review.rating === 3 && "Good"}
                                  {review.rating === 4 && "Very Good"}
                                  {review.rating === 5 && "Excellent"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-purple-600 bg-purple-100 px-3 py-1 rounded-full font-medium">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm lg:text-base bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-300">
                          "{review.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-dashed border-purple-200">
                    <div className="text-6xl mb-4">🌟</div>
                    <h3 className="text-xl font-semibold text-purple-800 mb-2">No Reviews Yet</h3>
                    <p className="text-purple-600 font-medium max-w-md mx-auto">
                      Be the first to share your experience and help others make informed decisions!
                    </p>
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Agent Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <img
                  src={property.agentImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(property.agentName || 'Agent')}&background=4F46E5&color=fff&size=80`}
                  alt={property.agentName}
                  className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-blue-100"
                />
                <h3 className="font-bold text-lg text-gray-800">{property.agentName}</h3>
                <p className="text-gray-600 text-sm">{property.agentEmail}</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleWishlist}
                  disabled={wishlistMutation.isLoading}
                  className={`w-full py-3 px-4 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                    wishlistStatus 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white' 
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
                  }`}
                >
                  {wishlistMutation.isLoading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Loading...</>
                  ) : wishlistStatus ? (
                    <><span>💔</span> Remove from Wishlist</>
                  ) : (
                    <><span>❤️</span> Add to Wishlist</>
                  )}
                </button>
                
                <a 
                  href={`mailto:${property.agentEmail}?subject=Inquiry about ${property.title}`}
                  className="block w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full text-center font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>📧</span> Contact Agent
                  </span>
                </a>
                
                {user && (
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <span>🏠</span> Go to Dashboard
                  </button>
                )}
              </div>
            </div>

            {/* Property Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Property Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600 font-medium">👁️ Views</span>
                  <span className="font-bold text-blue-600">{property.views || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-600 font-medium">⭐ Reviews</span>
                  <span className="font-bold text-green-600">{reviews.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-600 font-medium">📅 Listed</span>
                  <span className="font-bold text-purple-600 text-sm">
                    {new Date(property.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">🔍 Status</span>
                  <span className={`font-bold capitalize text-sm ${
                    property.status === 'verified' ? 'text-green-600' :
                    property.status === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;