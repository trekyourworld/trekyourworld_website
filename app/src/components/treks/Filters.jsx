import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FunnelIcon, 
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const filterCategories = [
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
    price: []
  });
  
  const [expandedMobile, setExpandedMobile] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

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
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
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
            className="md:hidden flex items-center text-gray-700" 
            onClick={() => setExpandedMobile(!expandedMobile)}
          >
            {expandedMobile ? (
              <>
                <span className="mr-1">Hide Filters</span>
                <ChevronUpIcon className="h-4 w-4" />
              </>
            ) : (
              <>
                <span className="mr-1">Show Filters</span>
                <ChevronDownIcon className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className={`md:block ${expandedMobile ? 'block' : 'hidden'}`}>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filterCategories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleCategory(category.name)}
              >
                <h3 className="font-medium">{category.name}</h3>
                <ChevronDownIcon 
                  className={`h-4 w-4 transform transition-transform ${
                    expandedCategories[category.name] ? 'rotate-180' : ''
                  }`}
                />
              </div>
              
              <motion.div 
                className="space-y-1"
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
                      className="ml-2 text-gray-700 cursor-pointer select-none"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;