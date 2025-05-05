import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Component to protect routes that require user authentication (not admin)
const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while authentication status is being determined
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3">Authenticating...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Save the location they were trying to access for redirect after login
    return <Navigate to="/" state={{ from: location, openSignIn: true }} replace />;
  }

  // If they are authenticated, show the protected content
  return children;
};

export default UserProtectedRoute;