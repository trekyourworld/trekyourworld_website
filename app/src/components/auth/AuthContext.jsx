import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../../services/api/authService';

// Create authentication context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Get initial auth state from localStorage if available
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return authService.isAuthenticated();
  });
  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch user profile if authenticated but no user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated && !user) {
        try {
          setLoading(true);
          const response = await authService.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // If we can't get the user profile, log them out
          logout();
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);

  // Set up Google OAuth callback handler
  useEffect(() => {
    const handleGoogleCallback = async (event) => {
      if (event.data?.type === 'google-oauth-callback' && event.data?.code) {
        try {
          setLoading(true);
          setAuthError('');
          
          const response = await authService.googleCallback(event.data.code);
          
          setIsAuthenticated(true);
          setUser(response.data.user);
          
          // Store user data in localStorage for persistence
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
          console.error('Google auth callback error:', error);
          setAuthError(error.response?.data?.message || 'Google authentication failed');
        } finally {
          setLoading(false);
        }
      }
    };
    
    window.addEventListener('message', handleGoogleCallback);
    return () => window.removeEventListener('message', handleGoogleCallback);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setAuthError('');
      
      const response = await authService.login({ email, password });
      
      setIsAuthenticated(true);
      setUser(response.data.user);
      
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return true;
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Invalid email or password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      setAuthError('');
      
      // Call the auth service to invalidate the token on server
      await authService.logout();
      
      // Clean up local state
      setIsAuthenticated(false);
      setUser(null);
      
      // Force navigate to home page in components using this function
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server-side logout fails, clean up local state for security
      setIsAuthenticated(false);
      setUser(null);
      
      // Set error state if needed for user feedback
      setAuthError('Error during logout, but you have been logged out locally');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if current user is admin
  const isAdmin = () => {
    if (user) {
        for (const role of user.roles) {
            if (role === 'admin') {
                return true;
            }
        }
    }
    return false;
  };

  // Context value
  const value = {
    isAuthenticated,
    setIsAuthenticated, // Expose this function for AuthCallback
    user,
    setUser, // Expose this function for AuthCallback
    login,
    logout,
    authError,
    isAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;