import apiClient from './apiClient';

/**
 * Service for trek-related API operations
 */
export const treksService = {
  /**
   * Get all treks
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise<Object>} - Response with treks data
   */
  getAllTreks: async (params = {}) => {
    return apiClient.get('/treks', { params });
  },

  /**
   * Get a single trek by ID
   * @param {string|number} id - Trek ID
   * @returns {Promise<Object>} - Response with trek data
   */
  getTrekById: async (id) => {
    return apiClient.get(`/treks/${id}`);
  },

  /**
   * Search treks by criteria
   * @param {Object} searchParams - Search criteria
   * @returns {Promise<Object>} - Response with search results
   */
  searchTreks: async (searchParams) => {
    return apiClient.get('/treks/search', { params: searchParams });
  },

  /**
   * Fetch treks from the v1 API endpoint
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise<Array>} - Array of trek objects with organization, uuid, title, etc.
   */
  fetchTreksFromV1: async (params = {}) => {
    return apiClient.get('/v1/treks/search', { params });
  },

  /**
   * Filter treks using specific filter endpoint
   * @param {Object} params - All parameters including filters and pagination
   * @returns {Promise<Object>} - Response with filtered trek data
   */
  filterTreks: async (params = {}) => {
    // Separate pagination params from filter params
    const { page, limit, ...filterParams } = params;
    
    // Query params for pagination only
    const queryParams = { page, limit };
    
    // Send filter params in the request body
    return apiClient.post('/v1/treks/filter', filterParams, { params: queryParams });
  },

  /**
   * Fetch filter options from the API
   * @returns {Promise<Object>} - Object containing filter categories and their options
   */
  fetchFilterOptions: async () => {
    return apiClient.get('/v1/treks/filters');
  }
};

export default treksService;