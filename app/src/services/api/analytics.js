import apiClient from './apiClient';

/**
 * Service for analytics-related API calls.
 * 
 * @namespace analyticsService
 */

/**
 * Tracks a visitor by sending their user ID to the analytics endpoint.
 *
 * @async
 * @function
 * @memberof analyticsService
 * @param {string} userId - The unique identifier of the user to be tracked.
 * @returns {Promise<Object>} The response from the API client.
 */
export const analyticsService = {

    trackVisitor: async (userId) => {
        return apiClient.get('/v1/analytics/track-visitor', {
            headers: {
                "Content-Type": "application/json",
                "X-User-ID": userId,
            }
        });
    }

}