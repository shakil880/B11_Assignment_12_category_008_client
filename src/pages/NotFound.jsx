import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-16">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
        </div>
        
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
          <Link to="/properties" className="btn btn-outline">
            Browse Properties
          </Link>
        </div>
        
        <div className="mt-12">
          <svg className="w-64 h-64 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2zm0 0l9 5 9-5" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFound;