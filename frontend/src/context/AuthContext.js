import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from '../axiosConfig';

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
  const [error, setError] = useState(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const fetchingProfile = useRef(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && !fetchingProfile.current) {
        // Validate token format (basic check)
        try {
          // Check if token is not empty or malformed
          const parts = token.split('.');
          if (parts.length === 3) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await fetchUserProfile();
          } else {
            // Invalid token format
            handleInvalidToken();
          }
        } catch (err) {
          handleInvalidToken();
        }
      } else {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };

    if (!initialCheckDone) {
      initializeAuth();
    }
  }, [initialCheckDone]);

  const handleInvalidToken = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null); // Don't show error on initial load with invalid token
    setLoading(false);
    setInitialCheckDone(true);
  };

  const fetchUserProfile = async () => {
    if (fetchingProfile.current) {
      return; // Prevent multiple simultaneous calls
    }

    fetchingProfile.current = true;
    try {
      const response = await axios.get('/api/auth/profile');
      setUser(response.data.data.user);
      setError(null);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // Only show session expired error if user was previously authenticated
      if (user || initialCheckDone) {
        if (error.response?.status === 401 || error.response?.status === 404) {
          setError('Session expired. Please login again.');
        } else {
          setError('Unable to load user profile. Please try again.');
        }
      }
      
      // Clear invalid session data
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
      setInitialCheckDone(true);
      fetchingProfile.current = false;
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put('/api/auth/profile', profileData);
      setUser(response.data.data.user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.put('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isUser = () => {
    return user && user.role === 'user';
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    isAdmin,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
