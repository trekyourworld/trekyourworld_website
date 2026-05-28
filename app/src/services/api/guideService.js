import apiClient from './apiClient';

export const guideService = {
  // Profile
  getProfile: () => apiClient.get('/v1/guide/profile'),
  updateProfile: (data) => apiClient.put('/v1/guide/profile', data),

  // Trails
  getTrails: (params = {}) => apiClient.get('/v1/guide/trails', { params }),
  submitTrail: (data) => apiClient.post('/v1/guide/trails', data),
  updateTrail: (uuid, data) => apiClient.put(`/v1/guide/trails/${uuid}`, data),

  // Bookings & Earnings
  getBookings: (params = {}) => apiClient.get('/v1/guide/bookings', { params }),
  getEarnings: () => apiClient.get('/v1/guide/earnings'),

  // Admin: pending trail review
  getPendingTrails: (params = {}) => apiClient.get('/v1/admin/trails/pending', { params }),
  reviewTrail: (uuid, data) => apiClient.put(`/v1/admin/trails/${uuid}/review`, data),
};
