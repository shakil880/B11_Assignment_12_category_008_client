// Firebase Configuration Debug Component
import { auth } from '../../services/firebase';

const FirebaseDebug = () => {
  const checkFirebaseConfig = () => {
    console.log('=== Firebase Configuration Check ===');
    console.log('Auth instance:', auth);
    
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const appId = import.meta.env.VITE_FIREBASE_APP_ID;
    
    console.log('API Key:', apiKey ? `✓ Set (${apiKey.substring(0, 10)}...)` : '✗ Missing or Invalid');
    console.log('Auth Domain:', authDomain ? `✓ Set (${authDomain})` : '✗ Missing');
    console.log('Project ID:', projectId ? `✓ Set (${projectId})` : '✗ Missing');
    console.log('App ID:', appId ? `✓ Set (${appId.substring(0, 15)}...)` : '✗ Missing');
    console.log('Current Domain:', window.location.hostname);
    
    // Check for common issues
    if (apiKey === 'your_firebase_api_key_here' || apiKey === 'your_api_key') {
      console.error('🚨 API Key is still using placeholder value!');
    }
    if (!apiKey || apiKey.length < 30) {
      console.error('🚨 API Key appears to be invalid (too short)');
    }
    if (authDomain === 'your_project_id.firebaseapp.com') {
      console.error('🚨 Auth Domain is still using placeholder value!');
    }
    
    console.log('=== End Configuration Check ===');
  };

  return (
    <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
      <button 
        onClick={checkFirebaseConfig}
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Debug Firebase
      </button>
    </div>
  );
};

export default FirebaseDebug;