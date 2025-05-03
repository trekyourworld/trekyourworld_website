import apiClient from './apiClient';

/**
 * Service for authentication-related API operations
 */
export const authService = {
  /**
   * Log in a user
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Promise<Object>} - Response with user data and token
   */
  login: async (credentials) => {
    const response = await apiClient.post('/v1/auth/admin/login', credentials);
    
    // If successful, store the token
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Response with user data
   */
  register: async (userData) => {
    return apiClient.post('/auth/register', userData);
  },

  /**
   * Process Google OAuth callback
   * @param {string} code - Authorization code from Google
   * @returns {Promise<Object>} - Response with user data and token
   */
  googleCallback: async (code) => {
    const response = await apiClient.post('/v1/auth/google/callback', { code });
    
    // If successful, store the token
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },

  /**
   * Log out the current user
   * @returns {Promise<Object>} - Response from the server
   */
  logout: async () => {
    try {
      // Call the logout endpoint to invalidate the token on the server
      const response = await apiClient.post('/v1/auth/admin/logout');
      
      // Clear all auth-related data from localStorage regardless of server response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Clear any auth cookies if they exist
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      return response;
    } catch (error) {
      // Even if the server request fails, clear local auth data for security
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Re-throw the error for handling by the caller
      throw error;
    }
  },

  /**
   * Get the current logged-in user's profile
   * @returns {Promise<Object>} - Response with user profile data
   */
  getProfile: async () => {
    return apiClient.get('/auth/profile');
  },

  /**
   * Check if the user is authenticated
   * @returns {boolean} - True if the user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  }
};

export default authService;