const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  showMessage = true,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="loading-spinner mb-4">
        <div className={`spinner ${sizeClasses[size]}`}></div>
      </div>
      {showMessage && (
        <p className="text-gray-600 text-sm font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;