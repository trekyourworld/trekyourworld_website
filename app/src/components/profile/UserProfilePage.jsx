import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useSearchParams } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import PersonalInfoSection from './PersonalInfoSection';
import SavedTreksSection from './SavedTreksSection';
import MyTrailsTab from './MyTrailsTab';
import GuideBookingsTab from './GuideBookingsTab';
import GuideEarningsTab from './GuideEarningsTab';
import GuideReviewsTab from './GuideReviewsTab';
import MyReviewsTab from './MyReviewsTab';
import SuggestTrekTab from './SuggestTrekTab';
import { authService } from '../../services/api/authService';

const UserProfilePage = () => {
  const { user, setUser, isGuide } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(
    searchParams.get('tab') === 'suggest' ? 'suggest-trek' : 'personal-info'
  );
  const showGuide = isGuide();
  
  // Fetch latest user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await authService.getProfile();
        if (response.data) {
          // Update the user data in the auth context
          setUser(response.data);
        }
      } catch (err) {
        setError('Failed to load profile data. Please try again later.');
        console.error('Error fetching profile data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [setUser]);
  
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <ProfileHeader user={user} />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 bg-gray-50 p-6 border-r border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Profile Menu</h3>
            <nav className="space-y-3">
              <button 
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  activeSection === 'personal-info' 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
                onClick={() => handleSectionChange('personal-info')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Personal Information</span>
              </button>
              
              <button 
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  activeSection === 'saved-treks' 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
                onClick={() => handleSectionChange('saved-treks')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                <span>Saved Treks</span>
              </button>

              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  activeSection === 'my-reviews' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'
                }`}
                onClick={() => handleSectionChange('my-reviews')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>My Reviews</span>
              </button>

              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  activeSection === 'suggest-trek' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'
                }`}
                onClick={() => handleSectionChange('suggest-trek')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Suggest a Trek</span>
              </button>

              {showGuide && (
                <>
                  <button
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                      activeSection === 'my-trails' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleSectionChange('my-trails')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>My Trails</span>
                  </button>
                  <button
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                      activeSection === 'guide-bookings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleSectionChange('guide-bookings')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <span>Bookings</span>
                  </button>
                  <button
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                      activeSection === 'guide-earnings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleSectionChange('guide-earnings')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <span>Earnings</span>
                  </button>
                  <button
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                      activeSection === 'guide-reviews' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleSectionChange('guide-reviews')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 000 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>Trail Reviews</span>
                  </button>
                </>
              )}
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3 p-8">
            {activeSection === 'personal-info' && (
              <div className="animate-fadeIn">
                <PersonalInfoSection user={user} setUser={setUser} />
              </div>
            )}
            
            {activeSection === 'saved-treks' && (
              <div className="animate-fadeIn">
                <SavedTreksSection user={user} />
              </div>
            )}

            {activeSection === 'my-reviews' && (
              <div className="animate-fadeIn">
                <MyReviewsTab />
              </div>
            )}

            {activeSection === 'suggest-trek' && (
              <div className="animate-fadeIn">
                <SuggestTrekTab />
              </div>
            )}

            {activeSection === 'my-trails' && (
              <div className="animate-fadeIn">
                <MyTrailsTab user={user} />
              </div>
            )}

            {activeSection === 'guide-bookings' && (
              <div className="animate-fadeIn">
                <GuideBookingsTab />
              </div>
            )}

            {activeSection === 'guide-earnings' && (
              <div className="animate-fadeIn">
                <GuideEarningsTab />
              </div>
            )}

            {activeSection === 'guide-reviews' && (
              <div className="animate-fadeIn">
                <GuideReviewsTab />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;