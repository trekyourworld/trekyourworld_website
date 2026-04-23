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

}