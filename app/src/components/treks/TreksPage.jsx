import { useState, useEffect, useCallback, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import Filters from './Filters';
import TrekCard from '../ui/TrekCard';
import { treksService } from '../../services/api/treksService';

// Mock data for fallback in case API fails
const mockTrekData = [
  {
    id: 1,
    name: "Everest Base Camp",
    image: "https://images.unsplash.com/photo-1515876305430-f06edab8282a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    location: "Nepal",
    difficulty: "Difficult",
    duration: "14 days",
    rating: 4.9,
    price: 1299,
    description: "Trek to the base of the world's highest mountain through stunning Sherpa villages and breathtaking landscapes."
  },
  {
    id: 2,
    name: "Inca Trail to Machu Picchu",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    location: "Peru",
    difficulty: "Moderate",
    duration: "4 days",
    rating: 4.8,
    price: 999,
    description: "Follow in the footsteps of the ancient Incas to the magnificent citadel of Machu Picchu."
  },
  {
    id: 3,
    name: "Annapurna Circuit",
    image: "https://images.unsplash.com/photo-1544652742-b499ff0631bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    location: "Nepal",
    difficulty: "Difficult",
    duration: "21 days",
    rating: 4.7,
    price: 1499,
    description: "Complete the full circuit around the Annapurna Massif, passing through diverse landscapes and cultures."
  },
  {
    id: 4,
    name: "Tour du Mont Blanc",
    image: "https://images.unsplash.com/photo-1522527414937-8c7a25215fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    location: "France, Italy, Switzerland",
    difficulty: "Moderate",
    duration: "11 days",
    rating: 4.8,
    price: 1099,
    description: "Circumnavigate the Mont Blanc massif through three alpine countries with stunning mountain views."
  },
  {
    id: 5,
    name: "Mount Kilimanjaro",
    image: "https://images.unsplash.com/photo-1521150932951-303a2303cd46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    location: "Tanzania",
    difficulty: "Difficult",
    duration: "7 days",
    rating: 4.6,
    price: 1799,
    description: "Climb to the roof of Africa on one of the world's most iconic and challenging treks."
  },
  {
    id: 6,
    name: "Torres del Paine W Trek",
    image: "https://images.unsplash.com/photo-1520781359607-59ae63e4fb8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    location: "Chile",
    difficulty: "Moderate",
    duration: "5 days",
    rating: 4.9,
    price: 1299,
    description: "Explore the dramatic landscapes of Patagonia with its stunning glaciers, lakes, and granite towers."
  },
  {
    id: 7,
    name: "Milford Track",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    location: "New Zealand",
    difficulty: "Moderate",
    duration: "4 days",
    rating: 4.9,
    price: 899,
    description: "Discover New Zealand's most famous walking track through lush rainforests, past crystal-clear lakes and dramatic waterfalls."
  },
  {
    id: 8,
    name: "Appalachian Trail",
    image: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    location: "USA",
    difficulty: "Extreme",
    duration: "180 days",
    rating: 4.7,
    price: 3599,
    description: "Thru-hike the legendary Appalachian Trail stretching across 14 states from Georgia to Maine."
  },
  {
    id: 9,
    name: "Salkantay Trek",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    location: "Peru",
    difficulty: "Difficult",
    duration: "5 days",
    rating: 4.6,
    price: 699,
    description: "A less crowded alternative to the Inca Trail, offering diverse landscapes from snow-capped mountains to tropical forests."
  },
  {
    id: 10,
    name: "West Highland Way",
    image: "https://images.unsplash.com/photo-1548247661-3d7905940716?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    location: "Scotland",
    difficulty: "Moderate",
    duration: "8 days",
    rating: 4.5,
    price: 899,
    description: "Scotland's premier long-distance trail through the stunning highlands, from Milngavie to Fort William."
  },
  {
    id: 11,
    name: "Overland Track",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    location: "Australia",
    difficulty: "Moderate",
    duration: "6 days",
    rating: 4.7,
    price: 999,
    description: "A magnificent walk through the heart of Tasmania's World Heritage wilderness area."
  },
  {
    id: 12,
    name: "Kungsleden Trail",
    image: "https://images.unsplash.com/photo-1534880642999-3acc7749e8c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    location: "Sweden",
    difficulty: "Moderate",
    duration: "15 days",
    rating: 4.6,
    price: 1299,
    description: "Experience the stunning landscapes of Swedish Lapland above the Arctic Circle."
  }
];

// Helper function to transform API data to match our component's expected format
const transformApiTrek = (apiTrek) => {
  return {
    id: apiTrek.uuid,
    name: apiTrek.title,
    image: `https://images.unsplash.com/photo-1515876305430-f06edab8282a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80`, // Default image as API doesn't provide one
    location: apiTrek.location || "Unknown",
    difficulty: Array.isArray(apiTrek.difficulty) ? apiTrek.difficulty[0] : "Moderate",
    duration: apiTrek.duration ? `${apiTrek.duration} days` : "Unknown",
    rating: 4.5, // Default rating as API doesn't provide one
    price: apiTrek.cost ? parseInt(apiTrek.cost.replace(',', '')) : 999,
    description: `Trek to ${apiTrek.title} - Elevation: ${apiTrek.elevation || 'N/A'}`,
    elevation: apiTrek.elevation,
    organiser: apiTrek.organiser || "Unknown"
  };
};

const TreksPage = () => {
  const [treks, setTreks] = useState([]);
  const [allTreks, setAllTreks] = useState([]); // Keep for filter operations
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    difficulty: [],
    duration: [],
    location: [],
    price: [],
    organiser: []
  });
  const [error, setError] = useState(null);
  const [isServerSearch, setIsServerSearch] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTreks, setTotalTreks] = useState(0);
  const [perPage] = useState(12);
  
  // Filter metadata state
  const [filterMetadata, setFilterMetadata] = useState(null);
  const [filterError, setFilterError] = useState(null);
  
  // Use ref for the current page to keep the value consistent in callbacks
  const currentPageRef = useRef(currentPage);
  
  // Update the ref whenever the currentPage state changes
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Fetch filter metadata on component mount
  useEffect(() => {
    const fetchFilterMetadata = async () => {
      try {
        const response = await treksService.fetchFilterOptions();
        if (response && response.data) {
          setFilterMetadata(response.data);
          setFilterError(null);
        }
      } catch (err) {
        console.error("Error fetching filter metadata:", err);
        setFilterError("Failed to load filter options");
      }
    };

    fetchFilterMetadata();
  }, []);

  // Apply client-side filters if server search fails
  const applyClientSideFilters = useCallback((treksData) => {
    let results = [...treksData];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        trek => 
          trek.name.toLowerCase().includes(term) || 
          trek.location.toLowerCase().includes(term) ||
          trek.description.toLowerCase().includes(term)
      );
    }

    // Apply other filters (difficulty, duration, location, price)
    if (activeFilters.difficulty.length > 0) {
      results = results.filter(trek => 
        activeFilters.difficulty.includes(trek.difficulty.toLowerCase())
      );
    }

    // Apply duration filters
    if (activeFilters.duration.length > 0) {
      results = results.filter(trek => {
        const days = parseInt(trek.duration);
        if (activeFilters.duration.includes('1-3')) {
          if (days >= 1 && days <= 3) return true;
        }
        if (activeFilters.duration.includes('4-7')) {
          if (days >= 4 && days <= 7) return true;
        }
        if (activeFilters.duration.includes('8-14')) {
          if (days >= 8 && days <= 14) return true;
        }
        if (activeFilters.duration.includes('15+')) {
          if (days >= 15) return true;
        }
        return false;
      });
    }

    // Apply location filters
    if (activeFilters.location.length > 0) {
      results = results.filter(trek => {
        const trekLocation = trek.location.toLowerCase();
        return activeFilters.location.some(location => 
          trekLocation.includes(location) || 
          (location === 'asia' && ['nepal', 'india', 'china', 'japan'].some(c => trekLocation.includes(c))) ||
          (location === 'europe' && ['france', 'italy', 'switzerland', 'scotland', 'sweden'].some(c => trekLocation.includes(c))) ||
          (location === 'north-america' && ['usa', 'canada', 'mexico'].some(c => trekLocation.includes(c))) ||
          (location === 'south-america' && ['peru', 'chile', 'argentina', 'brazil'].some(c => trekLocation.includes(c))) ||
          (location === 'africa' && ['tanzania', 'morocco', 'south africa'].some(c => trekLocation.includes(c))) ||
          (location === 'oceania' && ['australia', 'new zealand'].some(c => trekLocation.includes(c)))
        );
      });
    }

    // Apply price filters
    if (activeFilters.price.length > 0) {
      results = results.filter(trek => {
        const price = trek.price;
        if (activeFilters.price.includes('0-500')) {
          if (price >= 0 && price <= 500) return true;
        }
        if (activeFilters.price.includes('500-1000')) {
          if (price > 500 && price <= 1000) return true;
        }
        if (activeFilters.price.includes('1000-2000')) {
          if (price > 1000 && price <= 2000) return true;
        }
        if (activeFilters.price.includes('2000+')) {
          if (price > 2000) return true;
        }
        return false;
      });
    }
    
    // Apply organiser filters
    if (activeFilters.organiser.length > 0) {
      results = results.filter(trek => {
        const trekOrganiser = trek.organiser ? trek.organiser.toLowerCase() : '';
        return activeFilters.organiser.some(organiser => 
          trekOrganiser.includes(organiser.toLowerCase())
        );
      });
    }

    setTreks(results);
  }, [searchTerm, activeFilters]);

  // Function to fetch treks based on current state
  const fetchTreks = useCallback(async (page = currentPageRef.current) => {
    setIsLoading(true);
    try {
      // Create base params object with pagination
      const params = {
        page: page,
        limit: perPage
      };
      
      // Create filter params object for POST body when needed
      const filterParams = {};
      
      // Add search term to filter params if present
      if (searchTerm) {
        // Make search term an array with a single value
        filterParams.query = [searchTerm];
      }
      
      // Add filters to filter params if present - ensure all are string arrays
      if (activeFilters.difficulty.length > 0) {
        filterParams.difficulty = activeFilters.difficulty;
      }
      
      if (activeFilters.duration.length > 0) {
        filterParams.duration = activeFilters.duration;
      }
      
      if (activeFilters.location.length > 0) {
        filterParams.location = activeFilters.location;
      }
      
      if (activeFilters.price.length > 0) {
        filterParams.price = activeFilters.price;
      }
      
      if (activeFilters.organiser.length > 0) {
        filterParams.organiser = activeFilters.organiser;
      }
      
      // Check if any filters are applied
      const hasActiveFilters = Object.values(activeFilters).some(filterArray => filterArray.length > 0) || searchTerm;
      
      // Use different endpoint based on whether filters are applied
      let response;
      if (hasActiveFilters) {
        // Use filter endpoint with POST when filters are applied
        // Pagination params are passed in the URL, filter params in the body
        response = await treksService.filterTreks({
          ...filterParams,
          page,
          limit: perPage
        });
      } else {
        // Use standard search endpoint when no filters are applied
        // All params are passed in the URL
        response = await treksService.fetchTreksFromV1(params);
      }
      
      // Rest of the function remains unchanged
      if (response.data && Array.isArray(response.data.data)) {
        const transformedTreks = response.data.data.map(transformApiTrek);
        
        setTreks(transformedTreks);
        
        if (response.data.meta) {
          setTotalPages(response.data.totalPages || 1);
          setTotalTreks(response.data.totalItems || transformedTreks.length);
        }
        
        if (!searchTerm && Object.values(activeFilters).every(arr => arr.length === 0)) {
          setAllTreks(transformedTreks);
        }
        
        setError(null);
      } else if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
        const transformedTreks = response.data.data.data.map(transformApiTrek);
        
        setTreks(transformedTreks);
        
        if (response.data.data) {
          setTotalPages(response.data.data.totalPages || 1);
          setTotalTreks(response.data.data.totalItems || transformedTreks.length);
        }
        
        if (!searchTerm && Object.values(activeFilters).every(arr => arr.length === 0)) {
          setAllTreks(transformedTreks);
        }
        
        setError(null);
      } else {
        throw new Error('Invalid data format from API');
      }
    } catch (err) {
      console.error('Error fetching trek data:', err);
      setError('Failed to load trek data. Using mock data instead.');
      
      setIsServerSearch(false);
      setAllTreks(mockTrekData);
      applyClientSideFilters(mockTrekData);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, activeFilters, perPage, applyClientSideFilters]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchTreks(1);
    // This effect should only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search and filter changes - reset to page 1
  useEffect(() => {
    setCurrentPage(1);
    fetchTreks(1);
  }, [searchTerm, activeFilters, fetchTreks]);

  // Handle page changes
  useEffect(() => {
    if (currentPageRef.current === currentPage) {
      fetchTreks(currentPage);
    }
  }, [currentPage, fetchTreks]);

  // Apply client-side filtering when not using server search
  useEffect(() => {
    if (!isServerSearch && allTreks.length > 0) {
      applyClientSideFilters(allTreks);
    }
  }, [searchTerm, activeFilters, allTreks, isServerSearch, applyClientSideFilters]);

  // Handle search input
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle filter changes
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  // Explicitly handle page changes
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Treks</h1>
          <p className="text-gray-600 max-w-3xl">
            Explore our collection of handpicked treks around the world. Use the search and filters to find your perfect adventure.
          </p>
        </div>
        
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar filters */}
          <div className="w-full lg:w-1/4 lg:sticky lg:top-4 lg:self-start">
            <Filters onFilterChange={handleFilterChange} />
          </div>
          
          {/* Main content area */}
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                Found {totalTreks} treks
              </p>
              
              {/* Pagination Controls - Top */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePageChange(1)} 
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title="First Page"
                >
                  &laquo;
                </button>
                <button 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {/* Page number buttons */}
                <div className="hidden sm:flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show at most 5 pages with current page in the middle if possible
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 border rounded-md text-sm ${
                          currentPage === pageNum 
                            ? "bg-blue-600 text-white" 
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} 
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button 
                  onClick={() => handlePageChange(totalPages)} 
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Last Page"
                >
                  &raquo;
                </button>
              </div>
            </div>
            
            <div id="trek-listing">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : treks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No treks found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filters to find more options.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveFilters({
                        difficulty: [],
                        duration: [],
                        location: [],
                        price: [],
                        organiser: []
                      });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <>
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {treks.map((trek) => (
                      <motion.div key={trek.id} variants={item}>
                        <TrekCard trek={trek} />
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {/* Pagination Controls - Bottom */}
                  <div className="mt-10 flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{treks.length > 0 ? (currentPage - 1) * perPage + 1 : 0}</span> to{" "}
                      <span className="font-medium">{Math.min(currentPage * perPage, totalTreks)}</span> of{" "}
                      <span className="font-medium">{totalTreks}</span> treks
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handlePageChange(1)} 
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="First Page"
                      >
                        &laquo;
                      </button>
                      <button 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {/* Page number buttons */}
                      <div className="hidden sm:flex space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          // Show at most 5 pages with current page in the middle if possible
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-1 border rounded-md text-sm ${
                                currentPage === pageNum 
                                  ? "bg-blue-600 text-white" 
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button 
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                      <button 
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Last Page"
                      >
                        &raquo;
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreksPage;