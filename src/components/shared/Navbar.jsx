import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-container">
          {/* Brand */}
          <Link to="/" className="navbar-brand">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            Elite Properties
          </Link>

          {/* Desktop Navigation */}
          <ul className="navbar-nav">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/properties" className="nav-link">
                All Properties
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* User Menu */}
          <div className="navbar-user">
            {user ? (
              <div className="user-info">
                <div className="user-details">
                  {user.photoURL && (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName}
                      className="user-avatar"
                    />
                  )}
                  <span className="user-name">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline btn-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/properties" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                All Properties
              </Link>
              {user && (
                <>
                  <Link to="/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  
                  {/* User Info Section */}
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '12px' }}>
                    <div className="mobile-user-info">
                      {user.photoURL && (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName}
                          className="mobile-user-avatar"
                        />
                      )}
                      <span className="mobile-user-name">
                        {user.displayName || user.email}
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="mobile-logout-btn"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </>
              )}
              {!user && (
                <div className="mobile-auth-buttons">
                  <Link to="/login" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;