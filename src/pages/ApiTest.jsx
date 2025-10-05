import { useState } from 'react';
import api from '../services/api';

const ApiTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testEndpoint = async (url, method = 'GET', data = null) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (method === 'GET') {
        response = await api.get(url);
      } else if (method === 'POST') {
        response = await api.post(url, data);
      } else if (method === 'DELETE') {
        response = await api.delete(url);
      }
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const testData = {
    title: "Test Property",
    location: "Test City",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    priceRange: "$100,000 - $200,000",
    description: "A beautiful test property",
    agentName: "Test Agent",
    agentEmail: "test@example.com",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Testing Tool</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button 
          onClick={() => testEndpoint('/health')}
          className="btn btn-primary"
        >
          Test Health
        </button>
        
        <button 
          onClick={() => testEndpoint('/properties')}
          className="btn btn-secondary"
        >
          Get Properties
        </button>
        
        <button 
          onClick={() => testEndpoint('/properties?admin=true')}
          className="btn btn-info"
        >
          Get All Properties (Admin)
        </button>
        
        <button 
          onClick={() => testEndpoint('/advertised-properties')}
          className="btn btn-success"
        >
          Get Advertised Properties
        </button>
        
        <button 
          onClick={() => testEndpoint('/properties', 'POST', testData)}
          className="btn btn-warning"
        >
          Add Test Property
        </button>
        
        <button 
          onClick={() => testEndpoint('/seed-data', 'POST')}
          className="btn btn-success"
        >
          Seed Sample Data
        </button>
        
        <button 
          onClick={() => testEndpoint('/clear-data', 'DELETE')}
          className="btn btn-danger"
        >
          Clear All Data
        </button>
        
        <button 
          onClick={() => setResult(null)}
          className="btn btn-outline"
        >
          Clear Results
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="spinner mr-3"></div>
          <span>Loading...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
          <pre className="text-red-700 text-sm overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-800 font-semibold mb-2">Result:</h3>
          <pre className="text-green-700 text-sm overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;