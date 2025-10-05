import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import axios from 'axios';
import { auth } from '../services/firebase';
import api from '../services/api';
import toast from '../utils/toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  // Register user
  const register = async (email, password, name, imageUrl = null) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: imageUrl,
      });

      // Save user to database
      const userData = {
        uid: userCredential.user.uid,
        email: email,
        name: name,
        photoURL: imageUrl,
        role: 'user',
      };

      await api.post('/users', userData);
      
      // Get server JWT token
      const jwtResponse = await axios.post(`${API_BASE_URL}/jwt`, {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: name,
        photoURL: imageUrl,
        role: 'user'
      });
      localStorage.setItem('token', jwtResponse.data.token);

      toast.success('Registration successful!');
      return userCredential.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get server JWT token
      try {
        const userDoc = await axios.get(`${API_BASE_URL}/users/${userCredential.user.email}`);
        const jwtResponse = await axios.post(`${API_BASE_URL}/jwt`, {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userDoc.data.name || userCredential.user.displayName,
          photoURL: userDoc.data.photoURL || userCredential.user.photoURL,
          role: userDoc.data.role || 'user'
        });
        localStorage.setItem('token', jwtResponse.data.token);
      } catch (error) {
        console.error('Failed to get JWT token:', error);
        // Fallback: create basic JWT token
        const jwtResponse = await axios.post(`${API_BASE_URL}/jwt`, {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          role: 'user'
        });
        localStorage.setItem('token', jwtResponse.data.token);
      }

      toast.success('Login successful!');
      return userCredential.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Google login
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in database first
      try {
        await api.get(`/users/${user.uid}`);
      } catch (error) {
        // User doesn't exist, create new user
        if (error.response?.status === 404) {
          const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL,
            role: 'user',
          };
          
          try {
            await api.post('/users', userData);
          } catch (apiError) {
            console.warn('Failed to save user to database:', apiError);
            // Continue with authentication even if API fails
            toast.warning('Signed in successfully, but user data may not be synced');
          }
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
          console.warn('Backend API not available:', error);
          // Continue with authentication even if API is not available
          toast.warning('Signed in successfully, but backend is not connected');
        }
      }
      
      // Get server JWT token
      try {
        const userDoc = await axios.get(`${API_BASE_URL}/users/${user.email}`);
        const jwtResponse = await axios.post(`${API_BASE_URL}/jwt`, {
          uid: user.uid,
          email: user.email,
          name: userDoc.data.name || user.displayName,
          photoURL: userDoc.data.photoURL || user.photoURL,
          role: userDoc.data.role || 'user'
        });
        localStorage.setItem('token', jwtResponse.data.token);
      } catch (error) {
        console.error('Failed to get JWT token:', error);
        // Fallback: create basic JWT token  
        const jwtResponse = await axios.post(`${API_BASE_URL}/jwt`, {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          role: 'user'
        });
        localStorage.setItem('token', jwtResponse.data.token);
      }

      toast.success('Google login successful!');
      return result.user;
    } catch (error) {
      console.error('Google login error:', error);
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Google sign-in was cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup was blocked by browser. Please allow popups and try again');
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.error('Only one popup request is allowed at a time');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your internet connection');
      } else {
        toast.error(error.message || 'Google sign-in failed. Please try again');
      }
      
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Get user role
  const getUserRole = async () => {
    try {
      if (user) {
        const response = await api.get(`/users/${user.uid}`);
        return response.data.role;
      }
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'user';
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Get fresh token
          const idToken = await user.getIdToken();
          localStorage.setItem('token', idToken);
          setUser(user);
        } else {
          setUser(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    getUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};