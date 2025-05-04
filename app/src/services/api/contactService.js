// filepath: /Users/adityakumar/code/trekyourworld/trekyourworld_website/app/src/services/api/contactService.js
import apiClient from './apiClient';

/**
 * Contact form service for handling API calls related to the contact page
 */
const contactService = {
  /**
   * Submit a contact form message
   * @param {Object} contactData - The contact form data
   * @param {string} contactData.firstName - First name of the person
   * @param {string} contactData.lastName - Last name of the person (optional)
   * @param {string} contactData.email - Email address
   * @param {string} contactData.message - Message content
   * @returns {Promise} - Promise with the API response
   */
  submitContactForm: async (contactData) => {
    try {
      const response = await apiClient.post('/v1/contact', contactData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
};

export default contactService;