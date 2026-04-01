import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/services/api';

export const useAuth = () => {
  const [authState, setAuthState] = useState({
    user: null,
    isLoggedIn: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      // Keep the session persistent in localStorage (no forced 5-min inactivity logout)
      if (!token || !storedUser) {
        setAuthState({
          user: null,
          isLoggedIn: false,
          isLoading: false,
          error: null
        });
        return;
      }

      if (!token || !storedUser) {
        setAuthState({
          user: null,
          isLoggedIn: false,
          isLoading: false,
          error: null
        });
        return;
      }
      
      try {
        // If token and timestamp are valid, verify token with backend
        const response = await getCurrentUser();
        setAuthState({
          user: response.data,
          isLoggedIn: true,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.log('Token validation failed with backend. Logging out.', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
        localStorage.removeItem('lastActivityTimestamp');
        setAuthState({
          user: null,
          isLoggedIn: false,
          isLoading: false,
          error: 'Authentication failed'
        });
      }
    };

    // (Optional) Keep last activity timestamp updated for analytics/debug only
    const updateLastActivity = () => {
      const newTimestamp = Date.now();
      localStorage.setItem('lastActivityTimestamp', newTimestamp.toString());
    };

    window.addEventListener('mousemove', updateLastActivity);
    window.addEventListener('keydown', updateLastActivity);
    window.addEventListener('click', updateLastActivity);
    window.addEventListener('scroll', updateLastActivity);

    // Set initial last activity timestamp if logged in
    if (localStorage.getItem('token')) {
      localStorage.setItem('lastActivityTimestamp', Date.now().toString());
    }

    checkAuthStatus();

    // Cleanup event listeners
    return () => {
      window.removeEventListener('mousemove', updateLastActivity);
      window.removeEventListener('keydown', updateLastActivity);
      window.removeEventListener('click', updateLastActivity);
      window.removeEventListener('scroll', updateLastActivity);
    };
  }, []);

  const login = (userData, token) => {
    const currentTime = Date.now().toString();
    console.log('Login - Setting timestamps:', new Date(currentTime).toLocaleString());
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('loginTimestamp', currentTime);
    localStorage.setItem('lastActivityTimestamp', currentTime);
    
    setAuthState({
      user: userData,
      isLoggedIn: true,
      isLoading: false,
      error: null
    });
  };

  const logout = () => {
    console.log('Logout - Clearing all timestamps');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTimestamp');
    localStorage.removeItem('lastActivityTimestamp');
    
    setAuthState({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null
    });
  };

  return {
    user: authState.user,
    isLoggedIn: authState.isLoggedIn,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    logout
  };
};

export default useAuth; 