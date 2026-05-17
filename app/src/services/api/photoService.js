import apiClient from './apiClient';

export const photoService = {
    // Upload a photo for a trek (multipart/form-data)
    uploadPhoto: async (mountainId, caption, file) => {
        const form = new FormData();
        form.append('mountain_id', mountainId);
        form.append('caption', caption);
        form.append('file', file);
        return apiClient.post('/v1/photos', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    // Get logged-in user's own photos
    getMyPhotos: async (page = 1, limit = 20) => {
        return apiClient.get(`/v1/photos/my?page=${page}&limit=${limit}`);
    },

    // Delete own photo
    deleteMyPhoto: async (photoId) => {
        return apiClient.delete(`/v1/photos/${photoId}`);
    },

    // Get approved photos for a trek (public)
    getTrekPhotos: async (mountainId, page = 1, limit = 20) => {
        return apiClient.get(`/v1/mountains/${mountainId}/photos?page=${page}&limit=${limit}`);
    },
};
