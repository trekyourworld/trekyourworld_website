import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import treksService from '../../services/api/treksService';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [allTreks, setAllTreks] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    // Fetch all treks when component mounts
    const fetchTreks = async () => {
      try {
        const response = await treksService.getAllTreks();
        console.log(response)
        // Assuming the response data structure has treks with name and location properties
        // Transform data if needed to match the expected format
        const treksData = response.data.data.map((trek, index) => ({
          id: trek.id || index,
          name: trek.title,
          organiser: trek.organiser,
        }));
        setAllTreks(treksData);
      } catch (error) {
        console.error('Error fetching treks:', error);
        // Fallback to empty array if API call fails
        setAllTreks([]);
      }
    };

    fetchTreks();
  }, []);

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
      const filtered = allTreks.filter(
        trek => 
          trek.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (trek.location && trek.location.toLowerCase().includes(searchTerm.toLowerCase()))
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
  }, [searchTerm, onSearch, allTreks]);

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
                  className="px-4 py-2 hover:bg-gray-100 text-left cursor-pointer transition-colors"
                  onClick={() => selectSuggestion(suggestion)}
                >
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-gray-500">{suggestion.organiser}</div>
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