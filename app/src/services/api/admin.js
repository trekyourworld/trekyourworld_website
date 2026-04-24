import apiClient from './apiClient';

export const adminService = {

    dashboardInfo: async () => {
        return apiClient.get('/v1/admin/dashboard')
    },

    getRecentBookings: async () => {
        return apiClient.get('/v1/admin/bookings/recent')
    },

    // User management
    getUsers: async () => {
        return apiClient.get('/v1/admin/users')
    },

    updateUser: async (id, data) => {
        return apiClient.put(`/v1/admin/users/${id}`, data)
    },

    deleteUser: async (id) => {
        return apiClient.delete(`/v1/admin/users/${id}`)
    },

    // Banner management
    getBanners: async () => {
        return apiClient.get('/v1/admin/banners')
    },

    createBanner: async (data) => {
        return apiClient.post('/v1/admin/banners', data)
    },

    updateBanner: async (id, data) => {
        return apiClient.put(`/v1/admin/banners/${id}`, data)
    },

    deleteBanner: async (id) => {
        return apiClient.delete(`/v1/admin/banners/${id}`)
    },

    // Analytics
    getAnalytics: async (period) => {
        return apiClient.get(`/v1/admin/analytics?period=${period}`)
    },

    // Settings
    saveSettings: async (tab, data) => {
        return apiClient.put('/v1/admin/settings', { tab, data })
    },

}