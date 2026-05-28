import apiClient from './apiClient';

const communityService = {
    getCommunities: (params = {}) => apiClient.get('/v1/communities', { params }),
    getCommunityBySlug: (slug) => apiClient.get(`/v1/communities/${slug}`),
    getCommunityTrails: (slug, params = {}) => apiClient.get(`/v1/communities/${slug}/trails`, { params }),
    getCommunityGuides: (slug) => apiClient.get(`/v1/communities/${slug}/guides`),
};

export { communityService };
