import apiClient from './apiClient';

export const suggestionService = {
  /**
   * Submit a new trek suggestion (authenticated user).
   * POST /api/v1/suggestions
   */
  submitSuggestion: (data) => apiClient.post('/v1/suggestions', data),

  /**
   * Get suggestions submitted by the current user.
   * GET /api/v1/suggestions/my
   */
  getMySuggestions: (params = {}) => apiClient.get('/v1/suggestions/my', { params }),

  // ── Admin ──────────────────────────────────────────────────────────────────

  /**
   * Get all suggestions, optionally filtered by status.
   * GET /api/v1/admin/suggestions
   */
  getAdminSuggestions: (params = {}) => apiClient.get('/v1/admin/suggestions', { params }),

  /**
   * Get full detail for a single suggestion.
   * GET /api/v1/admin/suggestions/:id
   */
  getSuggestionDetail: (id) => apiClient.get(`/v1/admin/suggestions/${id}`),

  /**
   * Admin review action on a suggestion.
   * PUT /api/v1/admin/suggestions/:id/review
   * @param {string} action  accept | reject | duplicate | mark_review
   * @param {string} notes   optional admin notes
   */
  reviewSuggestion: (id, action, notes = '') =>
    apiClient.put(`/v1/admin/suggestions/${id}/review`, { action, adminNotes: notes }),
};
