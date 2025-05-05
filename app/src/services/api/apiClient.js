import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  // Base URL can be configured based on environment
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    // Get the auth token from localStorage if it exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Skip redirect for logout requests that might return 401
    const isLogoutRequest = originalRequest.url?.includes('/logout');
    
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry && !isLogoutRequest) {
      originalRequest._retry = true;
      
      // Clear auth data on 401 responses
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Clear any auth cookies
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // If this is a logout request, don't worry about errors
    // The auth service will clean up local storage
    if (isLogoutRequest) {
      console.warn('Logout request failed, but continuing with local logout');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;