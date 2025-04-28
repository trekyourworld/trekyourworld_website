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
   * Login with Google
   * @param {string} token - Google ID token
   * @returns {Promise<Object>} - Response with user data and token
   */
  googleLogin: async (token) => {
    const response = await apiClient.post('/v1/auth/google/login', { token });
    
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
   * Log out the current user
   * @returns {Promise<Object>} - Response from the server
   */
  logout: async () => {
    const response = await apiClient.post('/v1/auth/admin/logout');
    localStorage.removeItem('auth_token');
    return response;
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