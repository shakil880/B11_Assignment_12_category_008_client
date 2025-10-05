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
import { auth } from '../services/firebase';
import api from '../services/api';
import toast from 'react-hot-toast';

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
      
      // Get JWT token
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('token', idToken);

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
      
      // Get JWT token
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('token', idToken);

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
      
      // Save user to database if new
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
        role: 'user',
      };

      await api.post('/users', userData);
      
      // Get JWT token
      const idToken = await result.user.getIdToken();
      localStorage.setItem('token', idToken);

      toast.success('Google login successful!');
      return result.user;
    } catch (error) {
      toast.error(error.message);
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
      if (user) {
        // Get fresh token
        const idToken = await user.getIdToken();
        localStorage.setItem('token', idToken);
        setUser(user);
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
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