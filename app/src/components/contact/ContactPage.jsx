import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { INSTA_LINK } from '../../utils/constants';
import { contactService } from '../../services/api';
import { useAuth } from '../auth/AuthContext';

const ContactPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  const [error, setError] = useState(null);

  // Set user email from auth context when component mounts or auth state changes
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setFormData(prevState => ({
        ...prevState,
        email: user.email,
        // If user name is available, pre-fill name fields
        ...(user.name ? {
          firstName: user.name.split(' ')[0] || '',
          lastName: user.name.split(' ').slice(1).join(' ') || ''
        } : {})
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setError(null);
    
    try {
      // Extract name into firstName and lastName if needed
      let contactData = { ...formData };
      if (formData.name && !formData.firstName) {
        const nameParts = formData.name.trim().split(' ');
        contactData.firstName = nameParts[0];
        contactData.lastName = nameParts.slice(1).join(' ');
      }
      
      await contactService.submitContactForm(contactData);
      setFormStatus('success');
      setFormData({
        firstName: isAuthenticated && user?.name ? user.name.split(' ')[0] : '',
        lastName: isAuthenticated && user?.name ? user.name.split(' ').slice(1).join(' ') : '',
        email: isAuthenticated && user?.email ? user.email : '',
        message: ''
      });
    } catch (err) {
      console.error('Contact form submission failed:', err);
      setFormStatus('error');
      setError(err.response?.data?.message || 'Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">Contact Our Adventure Team</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Have questions about our treks or need help planning your adventure? 
            Our team of mountain enthusiasts is here to help you every step of the way.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-xl p-6 md:p-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
            
            {formStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <h3 className="text-2xl font-medium text-gray-800 mb-2">Thank You!</h3>
                <p className="text-gray-600">
                  We've received your message and will get back to you shortly.
                </p>
                <button 
                  onClick={() => setFormStatus(null)} 
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {formStatus === 'error' && (
                  <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    <p>{error || 'An error occurred. Please try again.'}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-5">
                    <label htmlFor="firstName" className="block text-gray-700 text-left mb-2">
                      First Name
                      {isAuthenticated && user?.name && (
                        <span className="text-xs text-gray-500 ml-2">(From your account)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 transition-all ${
                        isAuthenticated && user?.name ? "bg-gray-100 cursor-not-allowed focus:border-gray-300" : "focus:border-blue-500"
                      }`}
                      placeholder="John"
                      required
                      disabled={isAuthenticated && user?.name}
                      title={isAuthenticated && user?.name ? "Name is automatically set from your account" : ""}
                    />
                  </div>
                  
                  <div className="mb-5">
                    <label htmlFor="lastName" className="block text-gray-700 text-left mb-2">
                      Last Name
                      {isAuthenticated && user?.name && (
                        <span className="text-xs text-gray-500 ml-2">(From your account)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 transition-all ${
                        isAuthenticated && user?.name ? "bg-gray-100 cursor-not-allowed focus:border-gray-300" : "focus:border-blue-500"
                      }`}
                      placeholder="Doe"
                      disabled={isAuthenticated && user?.name}
                      title={isAuthenticated && user?.name ? "Name is automatically set from your account" : ""}
                    />
                  </div>
                </div>
                
                <div className="mb-5">
                  <label htmlFor="email" className="block text-gray-700 text-left mb-2">
                    Email Address
                    {isAuthenticated && user?.email && (
                      <span className="text-xs text-gray-500 ml-2">(Using your account email)</span>
                    )}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 transition-all ${
                      isAuthenticated && user?.email ? "bg-gray-100 cursor-not-allowed focus:border-gray-300" : "focus:border-blue-500"
                    }`}
                    placeholder="john@example.com"
                    required
                    disabled={isAuthenticated && user?.email}
                    title={isAuthenticated && user?.email ? "Email is automatically set from your account" : ""}
                  />
                  {isAuthenticated && user?.email && (
                    <p className="text-xs text-left text-gray-500 mt-1">This email is linked to your account and cannot be changed</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 text-left mb-2">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                    placeholder="Tell us about your adventure plans or questions..."
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center"
                >
                  {formStatus === 'submitting' ? (
                    <><span className="animate-spin mr-2 h-5 w-5 border-t-2 border-white rounded-full"></span> Sending...</>
                  ) : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
          
          {/* Contact Info & Map Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Contact Info Cards */}
            {/* <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transform transition-transform hover:scale-105">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-left text-gray-900 mb-1">Call Us</h3>
                  <p className="text-gray-600 text-left">+1 (555) 123-4567</p>
                  <p className="text-gray-600 text-left">Mon-Fri: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div> */}
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transform transition-transform hover:scale-105">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-left text-gray-900 mb-1">Email Us</h3>
                  <p className="text-gray-600 text-left">labs.neo73@gmail.com</p>
                  {/* <p className="text-gray-600 text-left">support@trekyourworld.com</p> */}
                </div>
              </div>
            </div>
            
            {/* <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transform transition-transform hover:scale-105">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-left text-gray-900 mb-1">Visit Us</h3>
                  <p className="text-gray-600 text-left">123 Adventure Street</p>
                  <p className="text-gray-600 text-left">Mountain View, CA 94043</p>
                </div>
              </div>
            </div> */}
            
            {/* Social Media Links */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-left text-gray-900 mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                {/* <a href="#" className="bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a> */}
                {/* <a href="#" className="bg-[#1DA1F2] p-3 rounded-full text-white hover:bg-blue-500 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.056 10.056 0 01-3.127 1.184A4.92 4.92 0 0012.9 8.586a13.955 13.955 0 01-10.14-5.142 4.92 4.92 0 001.522 6.574 4.908 4.908 0 01-2.23-.618v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-7.28 2.028 13.895 13.895 0 007.548 2.212c9.057 0 14.01-7.503 14.01-14.01 0-.214-.005-.428-.015-.64a9.988 9.988 0 002.46-2.548l-.047-.02z"/>
                  </svg>
                </a> */}
                <a href={INSTA_LINK} target="_blank" rel="noopener noreferrer" className="bg-[#E4405F] p-3 rounded-full text-white hover:bg-pink-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.235.598 1.8 1.162.564.564.912 1.132 1.162 1.8.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.162 1.8c-.564.564-1.132.912-1.8 1.162-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.8-1.162 4.902 4.902 0 01-1.162-1.8c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.162-1.8A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                  </svg>
                </a>
                {/* <a href="#" className="bg-[#0077B5] p-3 rounded-full text-white hover:bg-blue-800 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a> */}
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="mt-8 rounded-xl overflow-hidden shadow-lg bg-gray-200 h-64 flex items-center justify-center">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-gray-600">Interactive Map Coming Soon</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* FAQ Section */}
        <motion.div 
          className="max-w-4xl mx-auto mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-10">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-medium text-gray-900 mb-2">How far in advance should I book a trek?</h3>
              <p className="text-gray-600">We recommend booking your trek at least 3-6 months in advance, especially for popular destinations during peak season. This ensures availability and gives you ample time to prepare.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-medium text-gray-900 mb-2">What fitness level is required for your treks?</h3>
              <p className="text-gray-600">The required fitness level varies by trek. Easy treks are suitable for beginners with basic fitness, while difficult and extreme treks require previous trekking experience and excellent physical condition. Each trek listing includes specific fitness requirements.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-medium text-gray-900 mb-2">What equipment do I need to bring?</h3>
              <p className="text-gray-600">Upon booking, we provide a detailed packing list specific to your trek. Generally, you'll need appropriate hiking boots, weather-suitable clothing, personal items, and any medication you require. Some specialized equipment can be rented through our partners.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;