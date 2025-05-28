import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const ProfileHeader = ({ user }) => {
  return (
    <div className="relative">
      {/* Cover Image - Gradient background that matches app theme */}
      <div className="h-40 bg-gradient-to-r from-blue-600 to-blue-400"></div>      
      
      {/* Profile Image and Basic Info */}
      <div className="px-8 py-6 flex flex-col sm:flex-row items-center">
        <div className="mb-4 sm:mb-0 sm:mr-6 flex-shrink-0 -mt-12 sm:-mt-16">
          {user?.picture ? (
            <img 
              src={user.picture}
              alt={`${user?.name || 'User'}'s profile`}
              className="h-28 w-28 rounded-full border-4 border-white shadow-lg object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                // The parent element will show the UserCircleIcon when the image is hidden
              }}
            />
          ) : (
            <UserCircleIcon className="h-28 w-28 text-gray-400 bg-white rounded-full border-4 border-white shadow-lg" />
          )}
        </div>
        
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold">{user?.name || 'User Name'}</h2>
          <p className="text-gray-600">{user?.email || 'Email not available'}</p>
          {user?.roles && user.roles.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start">
              {user.roles.map((role, index) => (
                <span 
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mr-2 mb-2 font-medium"
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