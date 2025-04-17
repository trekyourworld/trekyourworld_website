import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';

// Mock data for search suggestions
const mockSuggestions = [
  { id: 1, name: "Everest Base Camp Trek", location: "Nepal" },
  { id: 2, name: "Annapurna Circuit", location: "Nepal" },
  { id: 3, name: "Inca Trail", location: "Peru" },
  { id: 4, name: "Mount Kilimanjaro", location: "Tanzania" },
  { id: 5, name: "Tour du Mont Blanc", location: "France/Italy/Switzerland" },
  { id: 6, name: "Torres del Paine W Trek", location: "Chile" },
  { id: 7, name: "Milford Track", location: "New Zealand" },
  { id: 8, name: "Appalachian Trail", location: "USA" }
];

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Filter suggestions based on search term
    if (searchTerm.length > 0) {
      const filtered = mockSuggestions.filter(
        suggestion => 
          suggestion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          suggestion.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }

    // Pass the search term to parent component
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    setIsFocused(false);
  };

  const selectSuggestion = (suggestion) => {
    setSearchTerm(suggestion.name);
    if (onSearch) {
      onSearch(suggestion.name);
    }
    setIsFocused(false);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for treks, locations, or activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
        </div>
      </form>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ul>
              {suggestions.map((suggestion) => (
                <li 
                  key={suggestion.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => selectSuggestion(suggestion)}
                >
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-gray-500">{suggestion.location}</div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;