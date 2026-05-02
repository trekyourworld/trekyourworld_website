import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Component to protect routes that require community_admin (or higher) role
const CommunityAdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCommunityAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3">Authenticating...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location, openSignIn: true }} replace />;
  }

  if (!isCommunityAdmin()) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default CommunityAdminProtectedRoute;
