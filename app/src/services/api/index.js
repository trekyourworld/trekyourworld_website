// Export all services from a single file for easier imports
import apiClient from './apiClient';
import authService from './authService';
import guidesService from './guidesService';
import treksService from './treksService';

// Export individual services
export {
  apiClient,
  authService,
  guidesService,
  treksService,
};

// Default export as an object containing all services
export default {
  apiClient,
  auth: authService,
  guides: guidesService,
  treks: treksService,
};