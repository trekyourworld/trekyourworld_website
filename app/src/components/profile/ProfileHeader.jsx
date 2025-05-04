import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const ProfileHeader = ({ user }) => {
  return (
    <div className="relative">
      {/* Cover Image - Static background or gradient */}
      <div className="h-32 bg-gradient-to-r from-green-500 to-blue-500"></div>      
      
      {/* Profile Image and Basic Info */}
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center">
        <div className="mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
          {user?.picture ? (
            <img 
              src={user.picture}
              alt={`${user?.name || 'User'}'s profile`}
              className="h-24 w-24 rounded-full border-4 border-white shadow"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                // The parent element will show the UserCircleIcon when the image is hidden
              }}
            />
          ) : (
            <UserCircleIcon className="h-24 w-24 text-gray-400 bg-white rounded-full border-4 border-white shadow" />
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-left">{user?.name || 'User Name'}</h2>
          <p className="text-gray-600 text-left">{user?.email || 'Email not available'}</p>
          {user?.roles && user.roles.length > 0 && (
            <div className="mt-2 text-left">
              {user.roles.map((role, index) => (
                <span 
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2"
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;