import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import PropertyCard from '../components/shared/PropertyCard';

const AllProperties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [statusFilter, setStatusFilter] = useState('verified');

  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', currentPage, searchTerm, sortBy, priceFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(sortBy && { sort: sortBy }),
        ...(priceFilter.min && { minPrice: priceFilter.min }),
        ...(priceFilter.max && { maxPrice: priceFilter.max }),
        ...(statusFilter && statusFilter !== '' && { status: statusFilter }),
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

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
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
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Properties</h1>
            <p className="text-gray-600">Discover verified properties from trusted agents</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <a href="/dashboard/add-property" className="btn btn-primary">➕ Add Property</a>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container mb-8">
        <div className="filters-grid">
          {/* Search - Full width on mobile */}
          <div className="col-span-full lg:col-span-1">
            <form onSubmit={handleSearch} className="search-input">
              <input
                type="text"
                className="form-input"
                placeholder="🔍 Search by location, title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          {/* Sort */}
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1); // Reset to first page when sorting changes
            }}
          >
            <option value="">Sort by (Default: Newest)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {/* Status Filter */}
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="verified">✅ Verified Properties</option>
            <option value="pending">⏳ Pending Approval</option>
            <option value="all">🔍 All Properties</option>
          </select>

          {/* Price Range - Better mobile layout */}
          <div className="col-span-full lg:col-span-1">
            <form onSubmit={handlePriceFilter} className="price-filter-form">
              <div className="flex gap-2">
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
              </div>
              <button type="submit" className="btn btn-primary mt-2 w-full lg:w-auto">
                Filter
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="properties-grid">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="property-card animate-pulse">
              <div className="bg-gray-300 h-56 rounded-t-lg"></div>
              <div className="p-5">
                <div className="h-4 bg-gray-300 rounded mb-3"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-4 w-3-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-1-2"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
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