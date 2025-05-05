import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect } from 'react';

// Component to protect routes that require admin authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, logout } = useAuth();
  const location = useLocation();

  // Automatically logout any non-admin user when they try to access /admin routes
  useEffect(() => {
    const handleAdminRouteAccess = async () => {
      // Only logout if user is authenticated but is NOT an admin
      if (isAuthenticated && !isAdmin()) {
        await logout();
        // After logout, they will be redirected to login page
      }
    };

    // Run the effect when component mounts (when user tries to access admin route)
    handleAdminRouteAccess();
  }, [isAuthenticated, isAdmin, logout]);

  // Show loading state while authentication status is being determined
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3">Authenticating...</p>
      </div>
    );
  }

  // If not authenticated or not admin, redirect to login
  if (!isAuthenticated || !isAdmin()) {
    // Save the location they were trying to access for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If they are authenticated and an admin, show the protected content
  return children;
};

export default ProtectedRoute;