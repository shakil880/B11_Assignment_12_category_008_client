const UserPropertyBought = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Bought</h1>
        <p className="text-gray-600">Track your property purchases and offers</p>
      </div>

      <div className="text-center py-16">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Property Purchases Yet
        </h3>
        <p className="text-gray-600 mb-6">
          When you make offers on properties, they'll appear here
        </p>
        <a href="/properties" className="btn btn-primary">
          Browse Properties
        </a>
      </div>
    </div>
  );
};

export default UserPropertyBought;