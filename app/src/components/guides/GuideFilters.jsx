import { useState } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';

const GuideFilters = ({ onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [experience, setExperience] = useState(0);
  const [availableDate, setAvailableDate] = useState('');
  const [trek, setTrek] = useState('');

  // List of available specializations (in a real app, this might come from an API)
  const availableSpecializations = [
    'High Altitude', 'Winter Treks', 'Family Treks', 'Photography', 
    'Wildlife', 'Cultural Treks', 'Technical Climbing', 'Alpine Treks'
  ];

  // List of available languages (in a real app, this might come from an API)
  const availableLanguages = [
    'English', 'Hindi', 'Nepali', 'French', 'Spanish', 'Urdu', 'Mandarin', 'Tibetan'
  ];

  const handleSpecializationChange = (e) => {
    const value = e.target.value;
    setSpecializations(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setLanguages(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const applyFilters = () => {
    onFilterChange({
      specializations,
      languages,
      experience,
      availableDate: availableDate || null,
      trek
    });
  };

  const clearFilters = () => {
    setSpecializations([]);
    setLanguages([]);
    setExperience(0);
    setAvailableDate('');
    setTrek('');
    
    onFilterChange({
      specializations: [],
      languages: [],
      experience: 0,
      availableDate: null,
      trek: ''
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          <span className="font-medium">Filters</span>
          <svg 
            className={`ml-1 h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {(specializations.length > 0 || languages.length > 0 || experience > 0 || availableDate || trek) && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear filters
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Specialization filters */}
            <div>
              <h4 className="text-gray-700 font-medium mb-2">Specializations</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableSpecializations.map((spec) => (
                  <label key={spec} className="flex items-center">
                    <input
                      type="checkbox"
                      value={spec}
                      checked={specializations.includes(spec)}
                      onChange={handleSpecializationChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Languages filters */}
            <div>
              <h4 className="text-gray-700 font-medium mb-2">Languages</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableLanguages.map((lang) => (
                  <label key={lang} className="flex items-center">
                    <input
                      type="checkbox"
                      value={lang}
                      checked={languages.includes(lang)}
                      onChange={handleLanguageChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Other filters */}
            <div className="space-y-4">
              {/* Experience filter */}
              <div>
                <h4 className="text-gray-700 font-medium mb-2">Minimum Experience</h4>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={experience}
                    onChange={(e) => setExperience(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-600 w-8">{experience} yr</span>
                </div>
              </div>

              {/* Available date filter */}
              <div>
                <h4 className="text-gray-700 font-medium mb-2">Available On</h4>
                <input
                  type="date"
                  value={availableDate}
                  onChange={(e) => setAvailableDate(e.target.value)}
                  min="2025-04-15"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Trek filter */}
              <div>
                <h4 className="text-gray-700 font-medium mb-2">Supported Trek</h4>
                <input
                  type="text"
                  placeholder="e.g. Everest Base Camp"
                  value={trek}
                  onChange={(e) => setTrek(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Apply filters button */}
          <div className="mt-6 text-right">
            <button
              type="button"
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideFilters;