import { createContext, useState, useContext, useEffect } from 'react';

// Create authentication context
const AuthContext = createContext();

// Mock admin credentials - in a real app this would be handled securely by the backend
const ADMIN_CREDENTIALS = {
  email: 'admin@trekyourworld.com',
  password: 'admin123'  // In a real app, never store passwords in frontend code
};

export const AuthProvider = ({ children }) => {
  // Get initial auth state from localStorage if available
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth === 'true';
  });
  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [authError, setAuthError] = useState('');

  // Update localStorage when authentication state changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    localStorage.setItem('user', user ? JSON.stringify(user) : null);
  }, [isAuthenticated, user]);

  // Login function
  const login = (email, password) => {
    // In a real app, this would be an API call to validate credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setUser({ email, role: 'admin' });
      setAuthError('');
      return true;
    } else {
      setAuthError('Invalid email or password');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  // Check if current user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Context value
  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    authError,
    isAdmin,
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