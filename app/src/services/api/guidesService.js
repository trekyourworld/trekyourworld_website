import apiClient from './apiClient';

/**
 * Service for guide-related API operations
 */
export const guidesService = {
  /**
   * Get all guides
   * @param {Object} params - Query parameters for filtering, pagination, etc.
   * @returns {Promise<Object>} - Response with guides data
   */
  getAllGuides: async (params = {}) => {
    return []
    // return apiClient.get('/guides', { params });
  },

  /**
   * Get a single guide by ID
   * @param {string|number} id - Guide ID
   * @returns {Promise<Object>} - Response with guide data
   */
  getGuideById: async (id) => {
    return apiClient.get(`/guides/${id}`);
  },

  /**
   * Search guides by criteria
   * @param {Object} searchParams - Search criteria
   * @returns {Promise<Object>} - Response with search results
   */
  searchGuides: async (searchParams) => {
    return apiClient.get('/guides/search', { params: searchParams });
  }
};

export default guidesService;