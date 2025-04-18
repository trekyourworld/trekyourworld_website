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
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
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
    user,
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