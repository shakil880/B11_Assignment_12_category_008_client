const UserWishlist = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">Properties you've saved for later</p>
      </div>

      <div className="text-center py-16">
        <div className="text-6xl mb-4">❤️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Your Wishlist is Empty
        </h3>
        <p className="text-gray-600 mb-6">
          Start adding properties to your wishlist to keep track of your favorites
        </p>
        <a href="/properties" className="btn btn-primary">
          Browse Properties
        </a>
      </div>
    </div>
  );
};

export default UserWishlist;