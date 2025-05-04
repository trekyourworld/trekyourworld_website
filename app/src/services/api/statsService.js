import apiClient from './apiClient';

/**
 * Service for statistics-related API operations
 */
export const statsService = {
  /**
   * Get system statistics including trek count, guides, and locations
   * @returns {Promise<Object>} - Response with statistics data
   */
  getStats: async () => {
    return apiClient.get('/v1/treks/stats');
  }
};

export default statsService;