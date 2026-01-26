import apiClient from './apiClient';

export const adminService = {

    dashboardInfo: async () => {
        return apiClient.get('/v1/admin/dashboard')
    }

}