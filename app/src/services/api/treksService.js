import apiClient from './apiClient';

/**
 * Service for trek-related API operations
 */
export const treksService = {
  /**
   * Get all treks
   * @param {Object} params - Query parameters for filtering, pagination, etc.
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
  }
};

export default treksService;