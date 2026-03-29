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
      const loginTimestamp = localStorage.getItem('loginTimestamp');
      const lastActivityTimestamp = localStorage.getItem('lastActivityTimestamp');
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

      console.log('Auth Check Debug:');
      console.log('Current Time:', new Date(currentTime).toLocaleString());
      console.log('Last Activity:', lastActivityTimestamp ? new Date(parseInt(lastActivityTimestamp)).toLocaleString() : 'No activity');
      console.log('Time Difference:', lastActivityTimestamp ? (currentTime - parseInt(lastActivityTimestamp)) / 1000 + ' seconds' : 'N/A');

      // Check if user has been inactive for more than 5 minutes
      if (lastActivityTimestamp && (currentTime - parseInt(lastActivityTimestamp, 10) > fiveMinutes)) {
        console.log('User inactive for more than 5 minutes. Logging out.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
        localStorage.removeItem('lastActivityTimestamp');
        setAuthState({
          user: null,
          isLoggedIn: false,
          isLoading: false,
          error: 'Session expired due to inactivity'
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

    // Update last activity timestamp on user interaction
    const updateLastActivity = () => {
      const newTimestamp = Date.now(); // Get timestamp as a number
      console.log('Activity detected, updating timestamp:', new Date(newTimestamp).toLocaleString());
      localStorage.setItem('lastActivityTimestamp', newTimestamp.toString()); // Store as string in localStorage
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', updateLastActivity);
    window.addEventListener('keydown', updateLastActivity);
    window.addEventListener('click', updateLastActivity);
    window.addEventListener('scroll', updateLastActivity);

    // Set initial last activity timestamp
    if (localStorage.getItem('token')) {
      const initialTimestamp = Date.now().toString();
      console.log('Setting initial activity timestamp:', new Date(initialTimestamp).toLocaleString());
      localStorage.setItem('lastActivityTimestamp', initialTimestamp);
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