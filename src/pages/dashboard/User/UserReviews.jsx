const UserReviews = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
        <p className="text-gray-600">Reviews you've written for properties</p>
      </div>

      <div className="text-center py-16">
        <div className="text-6xl mb-4">⭐</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Reviews Yet
        </h3>
        <p className="text-gray-600 mb-6">
          Share your experience by reviewing properties you've visited or bought
        </p>
        <a href="/properties" className="btn btn-primary">
          Browse Properties
        </a>
      </div>
    </div>
  );
};

export default UserReviews;