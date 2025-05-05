// Export all services from a single file for easier imports
import apiClient from './apiClient';
import authService from './authService';
import contactService from './contactService';
import guidesService from './guidesService';
import treksService from './treksService';

// Export individual services
export {
  apiClient,
  authService,
  contactService,
  guidesService,
  treksService,
};

// Default export as an object containing all services
export default {
  apiClient,
  auth: authService,
  contact: contactService,
  guides: guidesService,
  treks: treksService,
};