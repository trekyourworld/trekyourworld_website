import apiClient from './apiClient';

const bookingService = {
    getMyBookings: (params) => apiClient.get('/v1/bookings/my', { params }),
};

export { bookingService };
