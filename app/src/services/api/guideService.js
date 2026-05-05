import apiClient from './apiClient';

export const guideService = {
  // Profile
  getProfile: () => apiClient.request('GET', '/guide/profile'),
  updateProfile: (data) => apiClient.request('PUT', '/guide/profile', { body: data }),

  // Trails
  getTrails: (params = {}) => apiClient.request('GET', '/guide/trails', { params }),
  submitTrail: (data) => apiClient.request('POST', '/guide/trails', { body: data }),
  updateTrail: (uuid, data) => apiClient.request('PUT', `/guide/trails/${uuid}`, { body: data }),

  // Bookings & Earnings
  getBookings: (params = {}) => apiClient.request('GET', '/guide/bookings', { params }),
  getEarnings: () => apiClient.request('GET', '/guide/earnings'),

  // Admin: pending trail review
  getPendingTrails: (params = {}) => apiClient.request('GET', '/admin/trails/pending', { params }),
  reviewTrail: (uuid, data) => apiClient.request('PUT', `/admin/trails/${uuid}/review`, { body: data }),
};
