import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from "@/components/ui/use-toast";

const AdminAuthGuard = ({ children }) => {
  const { user, isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access the admin dashboard",
          variant: "destructive",
        });
        navigate('/login');
      } else if (user && user.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You do not have administrative privileges",
          variant: "destructive",
        });
        navigate('/'); // Redirect non-admins to home page
      }
    }
  }, [isLoggedIn, isLoading, user, navigate]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (isLoggedIn && user && user.role === 'admin') {
    return <>{children}</>;
  }

  return null; // Render nothing if not authorized while redirecting
};

export default AdminAuthGuard; 