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
    return apiClient.get('/v1/mountains', { params });
  },

  /**
   * Get a single trek by ID
   * @param {string|number} id - Trek ID
   * @returns {Promise<Object>} - Response with trek data
   */
  getTrekById: async (id) => {
    return apiClient.get(`/v1/mountains/${id}`);
  },

  /**
   * Search treks by criteria
   * @param {Object} searchParams - Search criteria
   * @returns {Promise<Object>} - Response with search results
   */
  searchTreks: async (searchParams) => {
    return apiClient.get('/mountains/search', { params: searchParams });
  },

  /**
   * Fetch treks from the v1 API endpoint
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise<Array>} - Array of trek objects with community, uuid, title, etc.
   */
  fetchTreksFromV1: async (params = {}) => {
    return apiClient.get('/v1/mountains/search', { params });
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
    return apiClient.post('/v1/mountains/filter', filterParams, { params: queryParams });
  },

  /**
   * Fetch filter options from the API
   * @returns {Promise<Object>} - Object containing filter categories and their options
   */
  fetchFilterOptions: async () => {
    return apiClient.get('/v1/mountains/filters');
  },
  
  /**
   * Fetch top/featured treks for the homepage
   * @param {Object} params - Optional parameters like limit
   * @returns {Promise<Array>} - Array of top trek objects
   */
  getTopTreks: async (params = {}) => {
    return apiClient.get('/v1/mountains/topTreks', { params });
  },

  /**
   * Create a new trek (admin only)
   * @param {Object} data - Trek data to create
   * @returns {Promise<Object>} - Created trek object
   */
  createTrek: async (data) => {
    return apiClient.post('/v1/mountains', data);
  },

  /**
   * Update an existing trek by UUID (admin only)
   * @param {string} uuid - Trek UUID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} - Updated trek object
   */
  updateTrek: async (uuid, data) => {
    return apiClient.put(`/v1/mountains/${uuid}`, data);
  },

  /**
   * Delete (soft-delete) a trek by UUID (admin only)
   * @param {string} uuid - Trek UUID
   * @returns {Promise<void>}
   */
  deleteTrek: async (uuid) => {
    return apiClient.delete(`/v1/mountains/${uuid}`);
  },
};

export default treksService;