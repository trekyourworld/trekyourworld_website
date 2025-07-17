import apiClient from './apiClient';

// Add a trek to bookmarks
export const addBookmark = async (trekId) => {
    const response = apiClient.post('/v1/bookmarks', { 'mountain_id': trekId });
    console.log('Bookmark added:', response);
    return response;
};

// Remove a trek from bookmarks
export const removeBookmark = async (trekId) => {
    return apiClient.delete(`/v1/bookmarks/${trekId}`);
};

// Get all bookmarks for the current user
export const getBookmarks = async () => {
    return apiClient.get('/v1/bookmarks');
};

export const getDetailedBookmarks = async () => {
    return apiClient.get('/v1/bookmarks?callType=detailed');
}

export const bookmarksService = {
    addBookmark,
    removeBookmark,
    getBookmarks,
};
