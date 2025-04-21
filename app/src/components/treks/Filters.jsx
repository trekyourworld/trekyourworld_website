import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FunnelIcon, 
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { treksService } from '../../services/api/treksService';

// Default filter categories as fallback
const defaultFilterCategories = [
  {
    name: 'Difficulty',
    options: [
      { value: 'easy', label: 'Easy' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'difficult', label: 'Difficult' },
      { value: 'extreme', label: 'Extreme' }
    ]
  },
  {
    name: 'Duration',
    options: [
      { value: '1-3', label: '1-3 days' },
      { value: '4-7', label: '4-7 days' },
      { value: '8-14', label: '8-14 days' },
      { value: '15+', label: '15+ days' }
    ]
  },
  {
    name: 'Location',
    options: [
      { value: 'asia', label: 'Asia' },
      { value: 'europe', label: 'Europe' },
      { value: 'north-america', label: 'North America' },
      { value: 'south-america', label: 'South America' },
      { value: 'africa', label: 'Africa' },
      { value: 'oceania', label: 'Oceania' }
    ]
  },
  {
    name: 'Price',
    options: [
      { value: '0-500', label: '$0-$500' },
      { value: '500-1000', label: '$500-$1000' },
      { value: '1000-2000', label: '$1000-$2000' },
      { value: '2000+', label: '$2000+' }
    ]
  }
];

const Filters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    difficulty: [],
    duration: [],
    location: [],
    price: [],
    organiser: [],
  });
  
  const [expandedMobile, setExpandedMobile] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [filterCategories, setFilterCategories] = useState(defaultFilterCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch filter options from API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setIsLoading(true);
      try {
        const response = await treksService.fetchFilterOptions();
        if (response && response.data && Array.isArray(response.data)) {
          // The API now returns the filter categories directly as an array
          const apiFilters = response.data;
          
          // Verify if the returned data matches our expected structure
          if (apiFilters.length > 0 && apiFilters.every(cat => cat.name && Array.isArray(cat.options))) {
            // Set the filter categories directly from the API
            setFilterCategories(apiFilters);
            
            // Initialize filter state based on the available categories
            const initialFilters = {};
            apiFilters.forEach(category => {
              initialFilters[category.name.toLowerCase()] = [];
            });
            
            // Update our filters state with the new structure
            setFilters(prev => ({
              ...initialFilters,
              // Preserve any active filters if the categories still exist
              ...Object.keys(prev).reduce((acc, key) => {
                const matchingCategory = apiFilters.find(cat => cat.name.toLowerCase() === key);
                if (matchingCategory) {
                  acc[key] = prev[key].filter(value => 
                    matchingCategory.options.some(opt => opt.value === value)
                  );
                }
                return acc;
              }, {})
            }));
            
            setError(null);
          } else {
            console.warn("Filter options API response has invalid structure, using defaults");
            setFilterCategories(defaultFilterCategories);
          }
        } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          // Handle nested data structure if present
          const apiFilters = response.data.data;
          
          if (apiFilters.length > 0 && apiFilters.every(cat => cat.name && Array.isArray(cat.options))) {
            setFilterCategories(apiFilters);
            
            // Initialize filter state based on the available categories
            const initialFilters = {};
            apiFilters.forEach(category => {
              initialFilters[category.name.toLowerCase()] = [];
            });
            
            // Update our filters state with the new structure
            setFilters(prev => ({
              ...initialFilters,
              // Preserve any active filters if the categories still exist
              ...Object.keys(prev).reduce((acc, key) => {
                const matchingCategory = apiFilters.find(cat => cat.name.toLowerCase() === key);
                if (matchingCategory) {
                  acc[key] = prev[key].filter(value => 
                    matchingCategory.options.some(opt => opt.value === value)
                  );
                }
                return acc;
              }, {})
            }));
            
            setError(null);
          } else {
            console.warn("Filter options API nested response has invalid structure, using defaults");
            setFilterCategories(defaultFilterCategories);
          }
        } else {
          // If response doesn't have the expected structure
          console.warn("Filter options API response is not in expected format, using defaults");
          setFilterCategories(defaultFilterCategories);
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);
        setError("Failed to load filter options. Using defaults.");
        setFilterCategories(defaultFilterCategories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };

  const handleFilterChange = (category, value) => {
    const updatedFilters = { ...filters };
    
    if (updatedFilters[category.toLowerCase()].includes(value)) {
      updatedFilters[category.toLowerCase()] = updatedFilters[category.toLowerCase()].filter(
        item => item !== value
      );
    } else {
      updatedFilters[category.toLowerCase()] = [...updatedFilters[category.toLowerCase()], value];
    }
    
    setFilters(updatedFilters);
    
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };
  
  const clearFilters = () => {
    const emptyFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});
    
    setFilters(emptyFilters);
    
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };
  
  const hasActiveFilters = () => {
    return Object.values(filters).some(filterArray => filterArray.length > 0);
  };

  const totalActiveFilters = Object.values(filters).reduce(
    (sum, filterArray) => sum + filterArray.length, 0
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Filter Treks</h2>
          {totalActiveFilters > 0 && (
            <span className="ml-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {totalActiveFilters}
            </span>
          )}
        </div>
        
        <div className="flex items-center">
          {hasActiveFilters() && (
            <button 
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 mr-4 text-sm font-medium transition-colors"
            >
              Clear All
            </button>
          )}
          <button 
            className="lg:hidden flex items-center text-gray-700" 
            onClick={() => setExpandedMobile(!expandedMobile)}
          >
            {expandedMobile ? (
              <>
                <XMarkIcon className="h-5 w-5" />
              </>
            ) : (
              <>
                <span className="mr-1">Filters</span>
                <ChevronDownIcon className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className={`lg:block ${expandedMobile ? 'block' : 'hidden'}`}>
        {isLoading ? (
          <div className="mt-4 text-center py-4">
            <div className="inline-block animate-spin h-5 w-5 border-2 border-blue-600 rounded-full border-t-transparent"></div>
            <span className="ml-2 text-gray-600">Loading filters...</span>
          </div>
        ) : (
          <>
            {/* Active filters summary - moved to top */}
            {hasActiveFilters() && (
              <div className="mt-4 mb-4 pt-3 border-t border-gray-200">
                <h3 className="font-medium text-sm mb-2">Active Filters:</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([category, values]) => 
                    values.map(value => {
                      // Find the label for this filter value
                      const categoryObj = filterCategories.find(cat => cat.name.toLowerCase() === category);
                      const optionObj = categoryObj?.options.find(opt => opt.value === value);
                      const label = optionObj?.label || value;
                      
                      return (
                        <div 
                          key={`${category}-${value}`}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs flex items-center"
                        >
                          <span>{label}</span>
                          <button 
                            onClick={() => handleFilterChange(category, value)}
                            className="ml-1 p-0.5 hover:bg-blue-100 rounded-full"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 space-y-4">
              {filterCategories.map((category) => (
                <div key={category.name} className="pb-3 border-b border-gray-200">
                  <div 
                    className="flex items-center justify-between cursor-pointer mb-2"
                    onClick={() => toggleCategory(category.name)}
                  >
                    <h3 className="font-medium">{category.name}</h3>
                    <ChevronDownIcon 
                      className={`h-4 w-4 transform transition-transform ${
                        expandedCategories[category.name] === false ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  
                  <motion.div 
                    className="space-y-2"
                    initial={{ height: "auto" }}
                    animate={{ 
                      height: expandedCategories[category.name] === false ? 0 : "auto",
                      opacity: expandedCategories[category.name] === false ? 0 : 1
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden" }}
                  >
                    {category.options.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`filter-${category.name}-${option.value}`}
                          className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                          checked={filters[category.name.toLowerCase()].includes(option.value)}
                          onChange={() => handleFilterChange(category.name, option.value)}
                        />
                        <label 
                          htmlFor={`filter-${category.name}-${option.value}`}
                          className="ml-2 text-gray-700 cursor-pointer select-none text-sm"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          </>
        )}
        {error && (
          <div className="mt-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;