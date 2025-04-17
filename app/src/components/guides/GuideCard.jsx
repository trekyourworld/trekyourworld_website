import { useState } from 'react';
import { StarIcon, CalendarDaysIcon, LanguageIcon, MapPinIcon } from '@heroicons/react/24/solid';

const GuideCard = ({ guide }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Format dates to be more readable
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Guide image and basic info */}
      <div className="relative">
        <img 
          src={guide.image} 
          alt={`Guide ${guide.name}`}
          className="w-full h-56 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{guide.name}</h3>
          <div className="flex items-center mt-1">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-white">{guide.rating}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-200">{guide.experience} years experience</span>
          </div>
        </div>
      </div>

      {/* Guide information */}
      <div className="p-4">
        {/* Languages */}
        <div className="flex items-start mb-3">
          <LanguageIcon className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="ml-2">
            <p className="text-gray-600 text-left text-sm">Languages</p>
            <p className="font-medium text-left">{guide.languages.join(', ')}</p>
          </div>
        </div>

        {/* Specializations */}
        <div className="mb-4">
          <p className="text-gray-600 text-left text-sm">Specializations</p>
          <div className="flex flex-wrap text-left gap-2 mt-1">
            {guide.specializations.map((spec, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Preview of supported treks */}
        <div className="flex items-start mb-4">
          <MapPinIcon className="h-5 w-5 text-green-500 mt-0.5" />
          <div className="ml-2">
            <p className="text-gray-600 text-left text-sm">Supported Treks</p>
            <p className="font-medium text-left">
              {guide.supportedTreks.slice(0, 2).map(trek => trek.name).join(', ')}
              {guide.supportedTreks.length > 2 ? ` +${guide.supportedTreks.length - 2} more` : ''}
            </p>
          </div>
        </div>

        {/* Show/Hide details button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
        >
          {showDetails ? 'Hide details' : 'Show details'}
          <svg 
            className={`ml-1 h-4 w-4 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {/* Bio */}
            <div className="mb-4">
              <p className="text-gray-600 text-left text-sm">About</p>
              <p className="mt-1 text-left">{guide.bio}</p>
            </div>

            {/* Available dates */}
            <div className="mb-4">
              <p className="text-gray-600 text-sm text-left mb-2">Available Dates</p>
              <div className="space-y-2">
                {guide.availableDates.map((dateRange, index) => (
                  <div key={index} className="flex text-left">
                    <CalendarDaysIcon className="h-5 w-5 text-orange-500" />
                    <span className="ml-2">
                      {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* All supported treks */}
            <div>
              <p className="text-gray-600 text-left text-sm mb-2">All Supported Treks</p>
              <ul className="list-disc text-left list-inside space-y-1">
                {guide.supportedTreks.map(trek => (
                  <li key={trek.id}>{trek.name}</li>
                ))}
              </ul>
            </div>

            {/* Book guide button */}
            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Book This Guide
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideCard;