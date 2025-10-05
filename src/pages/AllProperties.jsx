import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import PropertyCard from '../components/shared/PropertyCard';

const AllProperties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', currentPage, searchTerm, sortBy, priceFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(sortBy && { sort: sortBy }),
        ...(priceFilter.min && { minPrice: priceFilter.min }),
        ...(priceFilter.max && { maxPrice: priceFilter.max }),
      });
      
      const response = await api.get(`/properties?${params.toString()}`);
      return response.data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Error Loading Properties
          </h2>
          <p className="text-gray-600">
            There was an error loading the properties. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Properties</h1>
        <p className="text-gray-600">Discover verified properties from trusted agents</p>
      </div>

      {/* Filters */}
      <div className="filters-container mb-8">
        <div className="filters-grid">
          {/* Search */}
          <form onSubmit={handleSearch} className="search-input">
            <input
              type="text"
              className="form-input"
              placeholder="Search by location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="search-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>

          {/* Sort */}
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {/* Price Range */}
          <form onSubmit={handlePriceFilter} className="flex gap-2">
            <input
              type="number"
              className="form-input"
              placeholder="Min Price"
              value={priceFilter.min}
              onChange={(e) => setPriceFilter(prev => ({ ...prev, min: e.target.value }))}
            />
            <input
              type="number"
              className="form-input"
              placeholder="Max Price"
              value={priceFilter.max}
              onChange={(e) => setPriceFilter(prev => ({ ...prev, max: e.target.value }))}
            />
            <button type="submit" className="btn btn-primary">Filter</button>
          </form>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
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
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              {data?.total || 0} properties found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>

          {data?.properties?.length > 0 ? (
            <>
              <div className="properties-grid">
                {data.properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </button>
                  
                  {[...Array(data.totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    className="pagination-btn"
                    disabled={currentPage === data.totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Properties Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or check back later for new listings.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllProperties;