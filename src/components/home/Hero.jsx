import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="hero">
      <div className="container">
        <div className="text-center">
          <h1 className="hero-title">
            Find Your Dream Property
          </h1>
          <p className="hero-subtitle">
            Discover the perfect home, office, or investment property with Elite Properties. 
            Your trusted partner in real estate excellence.
          </p>
          <div className="hero-buttons">
            {user ? (
              <Link to="/properties" className="btn btn-secondary btn-lg">
                Browse Properties
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;