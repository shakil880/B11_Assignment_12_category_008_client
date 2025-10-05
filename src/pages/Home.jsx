import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PropertyCard from '../components/shared/PropertyCard';
import Hero from '../components/home/Hero';
import FeaturesSection from '../components/home/FeaturesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  // Fetch featured properties for advertisement section
  const { data: featuredProperties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: async () => {
      const response = await api.get('/advertised-properties');
      return response.data;
    },
  });

  // Fetch latest reviews
  const { data: latestReviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['latest-reviews'],
    queryFn: async () => {
      const response = await api.get('/reviews/latest?limit=3');
      return response.data;
    },
  });

  return (
    <div className="home-page">
      {/* Hero Section */}
      <Hero />

      {/* Advertisement Section - Featured Properties */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="section-title">
            <h2>Featured Properties</h2>
            <p className="text-gray-600">Discover our handpicked premium properties</p>
          </div>

          {propertiesLoading ? (
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="property-card animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="properties-grid">
              {featuredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/properties" className="btn btn-primary btn-lg">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Latest User Reviews Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>What Our Clients Say</h2>
            <p className="text-gray-600">Real experiences from satisfied customers</p>
          </div>

          {reviewsLoading ? (
            <div className="grid grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="review-card animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-300 rounded mb-1 w-24"></div>
                      <div className="h-3 bg-gray-300 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {latestReviews.map((review) => (
                <div key={review._id} className="review-card card">
                  <div className="card-body">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={review.reviewer.photoURL || '/default-avatar.png'} 
                        alt={review.reviewer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{review.reviewer.name}</h4>
                        <p className="text-sm text-gray-600">{review.property.title}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.description}</p>
                    <div className="flex items-center mt-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Sell Your Property Section */}
      <section className="section bg-blue-600 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Sell Your Property?</h2>
            <p className="text-xl mb-8 text-blue-100">
              {user 
                ? "List your property with us and reach thousands of potential buyers."
                : "Sign in to list your property and reach thousands of potential buyers."
              }
            </p>
            <div className="flex justify-center gap-4">
              {user ? (
                <Link 
                  to="/add-property" 
                  className="btn btn-light px-8 py-3 text-lg font-semibold"
                >
                  List Your Property
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="btn btn-light px-8 py-3 text-lg font-semibold"
                >
                  Sign In to List Property
                </Link>
              )}
              <Link 
                to="/properties" 
                className="btn btn-outline-light px-8 py-3 text-lg font-semibold"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;