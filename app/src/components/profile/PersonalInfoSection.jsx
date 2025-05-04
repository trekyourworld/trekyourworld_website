import { useState } from 'react';
import { authService } from '../../services/api/authService';

const PersonalInfoSection = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    picture: user?.picture || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Call to your API service to update the user profile
      const response = await authService.updateProfile(formData);
      
      // Update the user data in the auth context
      if (response.data) {
        setUser(response.data);
        setSuccessMessage('Profile updated successfully!');
        
        // Exit edit mode
        setTimeout(() => {
          setIsEditing(false);
          setSuccessMessage(null);
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      picture: user?.picture || '',
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-100"
              disabled
              title="Email cannot be changed"
            />
            <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
          </div>
          
          <div>
            <label htmlFor="picture" className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture URL
            </label>
            <input
              type="url"
              id="picture"
              name="picture"
              value={formData.picture}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="https://example.com/your-picture.jpg"
            />
          </div>
          
          <div className="flex space-x-4 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className={`px-4 py-2 bg-green-500 text-white rounded-md ${
                isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:bg-green-600'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6 text-left">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
            <p className="mt-1 text-lg">{user?.name || 'Not provided'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Email Address</h4>
            <p className="mt-1 text-lg">{user?.email || 'Not provided'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
            <p className="mt-1 text-lg">
              {user?.createdAt 
                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'Information not available'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection;