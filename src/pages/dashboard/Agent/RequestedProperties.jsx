import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import { useState } from 'react';
import toast from '../../../utils/toast';

const RequestedProperties = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected

  // Fetch offers for agent's properties
  const { data: offers = [], isLoading, error } = useQuery({
    queryKey: ['agent-offers', user?.email],
    queryFn: async () => {
      const response = await api.get(`/offers/agent/${user.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  // Filter offers
  const filteredOffers = offers.filter(offer => 
    filter === 'all' || offer.status === filter
  );

  // Accept offer mutation
  const acceptOfferMutation = useMutation({
    mutationFn: async (offerId) => {
      await api.patch(`/offers/accept/${offerId}`);
    },
    onSuccess: () => {
      toast.success('Offer accepted successfully');
      queryClient.invalidateQueries(['agent-offers']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to accept offer');
    }
  });

  // Reject offer mutation
  const rejectOfferMutation = useMutation({
    mutationFn: async (offerId) => {
      await api.patch(`/offers/reject/${offerId}`);
    },
    onSuccess: () => {
      toast.success('Offer rejected');
      queryClient.invalidateQueries(['agent-offers']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject offer');
    }
  });

  const handleAcceptOffer = async (offerId) => {
    if (window.confirm('Accept this offer? This will notify the buyer.')) {
      await acceptOfferMutation.mutateAsync(offerId);
    }
  };

  const handleRejectOffer = async (offerId) => {
    if (window.confirm('Reject this offer? This action cannot be undone.')) {
      await rejectOfferMutation.mutateAsync(offerId);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      accepted: 'badge-success',
      rejected: 'badge-danger',
      bought: 'badge-info'
    };
    return badges[status] || 'badge-secondary';
  };

  const getOfferCounts = () => {
    return {
      all: offers.length,
      pending: offers.filter(o => o.status === 'pending').length,
      accepted: offers.filter(o => o.status === 'accepted').length,
      rejected: offers.filter(o => o.status === 'rejected').length,
      bought: offers.filter(o => o.status === 'bought').length
    };
  };

  const offerCounts = getOfferCounts();

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Requested Properties</h1>
          <p className="text-gray-600">Loading property requests...</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="spinner"></div>
          <span className="ml-3">Loading requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Requested Properties</h1>
          <p className="text-gray-600">Error loading requests</p>
        </div>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Requests
          </h3>
          <p className="text-gray-600 mb-6">
            {error.message || 'Unable to load property requests'}
          </p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Requested Properties</h1>
        <p className="text-gray-600">Manage offers and requests for your properties ({offers.length} total)</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: `All (${offerCounts.all})`, color: 'btn-outline' },
            { key: 'pending', label: `Pending (${offerCounts.pending})`, color: 'btn-warning' },
            { key: 'accepted', label: `Accepted (${offerCounts.accepted})`, color: 'btn-success' },
            { key: 'bought', label: `Bought (${offerCounts.bought})`, color: 'btn-info' },
            { key: 'rejected', label: `Rejected (${offerCounts.rejected})`, color: 'btn-danger' }
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`btn btn-sm ${
                filter === key ? color : 'btn-outline'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Offers List */}
      {filteredOffers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredOffers.map((offer) => (
            <div key={offer._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                {/* Property Image */}
                <div className="md:w-1/4">
                  <img
                    src={offer.property?.image || '/placeholder-property.jpg'}
                    alt={offer.property?.title || 'Property'}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                
                {/* Offer Details */}
                <div className="p-6 md:w-3/4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {offer.property?.title || 'Property Title'}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        📍 {offer.property?.location || 'Location'}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        Listed Price: {offer.property?.priceRange || 'N/A'}
                      </p>
                      <p className="text-lg font-semibold text-blue-600">
                        Offered: ${offer.offeredAmount?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <span className={`badge ${getStatusBadge(offer.status)}`}>
                      {offer.status}
                    </span>
                  </div>

                  {/* Buyer Information */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Buyer Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <p className="font-medium">{offer.buyer?.name || 'Private Buyer'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium">{offer.buyerEmail || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <p className="font-medium">{offer.buyer?.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Offer Date:</span>
                        <p className="font-medium">
                          {new Date(offer.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Offer Message */}
                  {offer.message && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Buyer Message</h4>
                      <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                        "{offer.message}"
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {offer.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAcceptOffer(offer._id)}
                          className="btn btn-success btn-sm"
                          disabled={acceptOfferMutation.isLoading}
                        >
                          ✅ Accept Offer
                        </button>
                        <button
                          onClick={() => handleRejectOffer(offer._id)}
                          className="btn btn-danger btn-sm"
                          disabled={rejectOfferMutation.isLoading}
                        >
                          ❌ Reject Offer
                        </button>
                      </>
                    )}
                    
                    <button className="btn btn-outline btn-sm">
                      📧 Contact Buyer
                    </button>
                    
                    <a
                      href={`/properties/${offer.propertyId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      👁️ View Property
                    </a>
                    
                    {offer.status === 'accepted' && (
                      <button className="btn btn-info btn-sm">
                        📋 Generate Contract
                      </button>
                    )}
                  </div>

                  {/* Status Messages */}
                  {offer.status === 'accepted' && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">
                        ✅ Offer accepted! Please contact the buyer to proceed with the sale.
                      </p>
                    </div>
                  )}
                  
                  {offer.status === 'bought' && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        🎉 Property sold! Transaction ID: {offer.transactionId || 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📫</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Property Requests
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'No offers have been made on your properties yet.' 
              : `No ${filter} offers found.`
            }
          </p>
          <a href="/dashboard/my-properties" className="btn btn-primary">
            View My Properties
          </a>
        </div>
      )}
    </div>
  );
};

export default RequestedProperties;