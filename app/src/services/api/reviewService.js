import apiClient from './apiClient';

export const reviewService = {
  /**
   * Submit a new review (authenticated user).
   * POST /api/v1/reviews
   */
  submitReview: (data) => apiClient.request('POST', '/reviews', { body: data }),

  /**
   * Get reviews submitted by the current user.
   * GET /api/v1/reviews/my
   */
  getMyReviews: (params = {}) => apiClient.request('GET', '/reviews/my', { params }),

  /**
   * Get published reviews for a specific trek (public).
   * GET /api/v1/mountains/:uid/reviews
   */
  getTrekReviews: (uid, params = {}) =>
    apiClient.request('GET', `/mountains/${uid}/reviews`, { params }),

  /**
   * Add / update a guide reply on a published review.
   * POST /api/v1/guide/reviews/:reviewId/reply
   */
  replyToReview: (reviewId, body) =>
    apiClient.request('POST', `/guide/reviews/${reviewId}/reply`, { body: { body } }),

  /**
   * Get published reviews for the guide's community trails.
   * GET /api/v1/guide/reviews
   */
  getGuideReviews: (params = {}) => apiClient.request('GET', '/guide/reviews', { params }),

  /**
   * Admin: get all reviews, optionally filtered by status.
   * GET /api/v1/admin/reviews
   */
  getAdminReviews: (params = {}) => apiClient.request('GET', '/admin/reviews', { params }),

  /**
   * Admin: approve or reject a review.
   * PUT /api/v1/admin/reviews/:id
   */
  moderateReview: (id, action) =>
    apiClient.request('PUT', `/admin/reviews/${id}`, { body: { action } }),
};
