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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ProfileHeader user={user} />
        
        <div className="grid grid-cols-1 md:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 bg-gray-50 p-4">
            <nav className="space-y-2">
              <button 
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeSection === 'personal-info' 
                    ? 'bg-green-100 text-green-800' 
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => handleSectionChange('personal-info')}
              >
                Personal Information
              </button>
              <button 
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeSection === 'saved-treks' 
                    ? 'bg-green-100 text-green-800' 
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => handleSectionChange('saved-treks')}
              >
                Saved Treks
              </button>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3 p-6">
            {activeSection === 'personal-info' && (
              <PersonalInfoSection user={user} setUser={setUser} />
            )}
            
            {activeSection === 'saved-treks' && (
              <SavedTreksSection user={user} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;