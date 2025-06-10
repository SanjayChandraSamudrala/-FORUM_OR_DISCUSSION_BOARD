import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthGuard = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      // The session expiry logic is now handled by useAuth hook
      // const loginTimestamp = localStorage.getItem('loginTimestamp');
      // const currentTime = Date.now();
      // const twoMinutes = 2 * 60 * 1000; // 2 minutes in milliseconds

      // console.log('AuthGuard Check:');
      // console.log('isLoggedIn:', isLoggedIn);
      // console.log('isLoading:', isLoading);
      // console.log('loginTimestamp:', loginTimestamp);
      // console.log('currentTime:', currentTime);

      if (isLoggedIn) {
        // if (loginTimestamp && (currentTime - parseInt(loginTimestamp, 10) > twoMinutes)) {
        //   console.log('Session Expired! Logging out.');
        //   // Session expired, log out
        //   localStorage.removeItem('token');
        //   localStorage.removeItem('user');
        //   localStorage.removeItem('loginTimestamp');
        //   navigate('/login');
        // } else {
          // User is logged in and session is still valid (handled by useAuth now)
          navigate('/threads');
        // }
      } else {
        // User is not logged in, allow access to children (login/register pages)
      }
    }
  }, [isLoggedIn, isLoading, navigate]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  // If not logged in and not loading, render the children (Login/Register pages)
  if (!isLoggedIn) {
    return <>{children}</>;
  }

  // If logged in and loading is complete, return null (handled by navigate above)
  return null;
};

export default AuthGuard; 