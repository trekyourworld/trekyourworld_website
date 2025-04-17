import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Component to protect routes that require admin authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // If not authenticated or not admin, redirect to login
  if (!isAuthenticated || !isAdmin()) {
    // Save the location they were trying to access for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If they are authenticated and an admin, show the protected content
  return children;
};

export default ProtectedRoute;