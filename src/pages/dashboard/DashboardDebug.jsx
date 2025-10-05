import { useAuth } from '../../contexts/AuthContext';

const DashboardDebug = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading auth...</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Dashboard Debug</h1>
      <div style={{ background: '#f5f5f5', padding: '10px', margin: '10px 0' }}>
        <h3>User Info:</h3>
        <p>Email: {user.email}</p>
        <p>Name: {user.displayName}</p>
        <p>UID: {user.uid}</p>
        <p>Photo: {user.photoURL}</p>
      </div>
      <div style={{ background: '#e8f5e8', padding: '10px', margin: '10px 0' }}>
        <h3>Auth Status:</h3>
        <p>User exists: {user ? 'Yes' : 'No'}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Token exists: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default DashboardDebug;