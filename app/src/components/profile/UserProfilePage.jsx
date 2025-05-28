import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import ProfileHeader from './ProfileHeader';
import PersonalInfoSection from './PersonalInfoSection';
import SavedTreksSection from './SavedTreksSection';
import { authService } from '../../services/api/authService';

const UserProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('personal-info');
  
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;