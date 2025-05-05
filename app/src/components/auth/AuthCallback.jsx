import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Component to handle OAuth callback redirects
 * This handles the token received from backend after successful OAuth authentication
 */
const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the token from URL parameters
    const token = searchParams.get('token');
    
    if (!token) {
      setError('Authentication failed: No token received');
      return;
    }

    // Store the token in localStorage
    localStorage.setItem('auth_token', token);
    
    // Get user info from token (JWT)
    try {
      // For JWT tokens, the payload is in the middle part (between the dots)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      // Decode the payload (middle part of JWT)
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Extract user data from token payload
      const user = {
        id: payload.sub || payload.user_id,
        email: payload.email,
        name: payload.name,
        roles: payload.roles || [],
        // Add any other user fields from payload
      };
      
      // Update authentication state
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      
      // Redirect to home page after successful login
      navigate('/');
    } catch (err) {
      console.error('Error parsing authentication token:', err);
      setError('Authentication failed: Invalid token');
      localStorage.removeItem('auth_token');
    }
  }, [searchParams, navigate, setUser, setIsAuthenticated]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-lg">Completing authentication...</p>
    </div>
  );
};

export default AuthCallback;