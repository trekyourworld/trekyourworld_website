import apiClient from './apiClient';

export const adminService = {

    dashboardInfo: async () => {
        return apiClient.get('/v1/admin/dashboard')
    },

    // 🔴 Backend: GET /v1/admin/bookings/recent not yet built
    getRecentBookings: async () => {
        return apiClient.get('/v1/admin/bookings/recent')
    },

}