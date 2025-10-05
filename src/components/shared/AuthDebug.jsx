import { useAuth } from '../../contexts/AuthContext';

const AuthDebug = () => {
  const { user, loading } = useAuth();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999 
    }}>
      <div><strong>Auth Debug:</strong></div>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>User: {user ? 'authenticated' : 'not authenticated'}</div>
      {user && (
        <div>
          <div>UID: {user.uid}</div>
          <div>Email: {user.email}</div>
          <div>Name: {user.displayName}</div>
        </div>
      )}
      <div>Token: {localStorage.getItem('token') ? 'exists' : 'missing'}</div>
    </div>
  );
};

export default AuthDebug;