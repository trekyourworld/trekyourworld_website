import { useState, useEffect, useCallback, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import TrekCard from '../ui/TrekCard';
import { treksService } from '../../services/api/treksService';
import Dropdown from './Dropdown';
import { transformApiTrek } from '../../utils/utils'; // Adjust the import path as necessary

const ExplorePage = () => {
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
    // Removed unused error state
    const [isServerSearch, setIsServerSearch] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTreks, setTotalTreks] = useState(0);
    const [perPage] = useState(12);

    // Filter metadata state
    const [filterMetadata, setFilterMetadata] = useState(null);
    // Removed unused filterError state

    // Use ref for the current page to keep the value consistent in callbacks
    const currentPageRef = useRef(currentPage);

    // State for trek comparison feature
    const [selectedTreks, setSelectedTreks] = useState([]);
    const navigate = useNavigate();

    // Update the ref whenever the currentPage state changes
    useEffect(() => {
        currentPageRef.current = currentPage;
    }, [currentPage]);

    // Handle trek selection/deselection for comparison
    const handleTrekSelection = useCallback((trekId) => {
        setSelectedTreks(prevSelected => {
            if (prevSelected.includes(trekId)) {
                return prevSelected.filter(id => id !== trekId);
            } else {
                return [...prevSelected, trekId];
            }
        });
    }, []);

    // Navigate to comparison page
    const navigateToComparison = useCallback(() => {
        if (selectedTreks.length >= 2) {
            navigate(`/compare-treks?ids=${selectedTreks.join(',')}`);
        }
    }, [selectedTreks, navigate]);

    // Fetch filter metadata on component mount
    useEffect(() => {
        const fetchFilterMetadata = async () => {
            try {
                const response = await treksService.fetchFilterOptions();
                if (response && response.data) {
                    setFilterMetadata(response.data.data);
                    // setFilterError(null); // removed unused error setter
                }
            } catch (err) {
                console.error("Error fetching filter metadata:", err);
                // setFilterError("Failed to load filter options"); // removed unused error setter
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

                // setError(null); // removed unused error setter
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

                // setError(null); // removed unused error setter
            } else {
                throw new Error('Invalid data format from API');
            }
        } catch (err) {
            console.error('Error fetching trek data:', err);
            // setError('Failed to load trek data. Using mock data instead.'); // removed unused error setter

            setIsServerSearch(false);
            //   setAllTreks(mockTrekData);
            //   applyClientSideFilters(mockTrekData);
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, activeFilters, perPage]);

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
    // const handleFilterChange = (filters) => {
    //     setActiveFilters(filters);
    // };

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
                    <p className="text-gray-600 w-full">
                        Explore our collection of handpicked treks around the world. Use the search and filters to find your perfect adventure.
                    </p>
                </div>

                <div className="mb-6">
                    <SearchBar onSearch={handleSearch} />
                </div>

                {/* Filters Row */}
                <div className="mb-6 flex flex-wrap gap-4 items-center">
                    {/* Difficulty Dropdown */}
                    <Dropdown
                        label="Difficulty:"
                        id="difficulty-select"
                        options={
                            filterMetadata && Array.isArray(filterMetadata)
                                ? (filterMetadata.find(f => f.name === 'Difficulty')?.options || [])
                                : []
                        }
                        value={activeFilters.difficulty}
                        onChange={vals => setActiveFilters(prev => ({
                            ...prev,
                            difficulty: vals
                        }))}
                        placeholder="All"
                        buttonClass="border-blue-300 focus:ring-blue-500 hover:border-blue-400"
                    />
                    {/* Duration Dropdown */}
                    <Dropdown
                        label="Duration:"
                        id="duration-select"
                        options={
                            filterMetadata && Array.isArray(filterMetadata)
                                ? (filterMetadata.find(f => f.name === 'Duration')?.options || [])
                                : []
                        }
                        value={activeFilters.duration}
                        onChange={vals => setActiveFilters(prev => ({
                            ...prev,
                            duration: vals
                        }))}
                        placeholder="All"
                        buttonClass="border-green-300 focus:ring-green-500 hover:border-green-400"
                    />
                    {/* Location Dropdown */}
                    <Dropdown
                        label="Location:"
                        id="location-select"
                        options={
                            filterMetadata && Array.isArray(filterMetadata)
                                ? (filterMetadata.find(f => f.name === 'Location')?.options || [])
                                : []
                        }
                        value={activeFilters.location}
                        onChange={vals => setActiveFilters(prev => ({
                            ...prev,
                            location: vals
                        }))}
                        placeholder="All"
                        buttonClass="border-purple-300 focus:ring-purple-500 hover:border-purple-400"
                    />
                </div>
                {/* Active Filters Display as removable pills */}
                {(activeFilters.difficulty.length > 0 || activeFilters.duration.length > 0 || activeFilters.location.length > 0) && (
                    <div className="mb-4 flex flex-wrap gap-2 items-center">
                        <span className="text-gray-700 font-medium">Active Filters:</span>
                        {activeFilters.difficulty.map(val => (
                            <span key={val} className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                {val.charAt(0).toUpperCase() + val.slice(1)}
                                <button
                                    type="button"
                                    className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                                    onClick={() => setActiveFilters(prev => ({
                                        ...prev,
                                        difficulty: prev.difficulty.filter(v => v !== val)
                                    }))}
                                    aria-label={`Remove ${val} filter`}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                        {activeFilters.duration.map(val => (
                            <span key={val} className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                {val}
                                <button
                                    type="button"
                                    className="ml-1 text-green-500 hover:text-green-700 focus:outline-none"
                                    onClick={() => setActiveFilters(prev => ({
                                        ...prev,
                                        duration: prev.duration.filter(v => v !== val)
                                    }))}
                                    aria-label={`Remove ${val} filter`}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                        {activeFilters.location.map(val => (
                            <span key={val} className="flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                                {val.charAt(0).toUpperCase() + val.slice(1)}
                                <button
                                    type="button"
                                    className="ml-1 text-purple-500 hover:text-purple-700 focus:outline-none"
                                    onClick={() => setActiveFilters(prev => ({
                                        ...prev,
                                        location: prev.location.filter(v => v !== val)
                                    }))}
                                    aria-label={`Remove ${val} filter`}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Remove sidebar Filters component and update layout */}
                <div className="flex flex-col gap-6">
                    {/* Main content area */}
                    <div className="w-full lg:w-full">
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
                                                className={`px-3 py-1 border rounded-md text-sm ${currentPage === pageNum
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
                                    {/* Comparison Action Bar */}
                                    {selectedTreks.length > 0 && (
                                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
                                            <div className="text-sm text-blue-800">
                                                <span className="font-medium">{selectedTreks.length}</span> trek{selectedTreks.length !== 1 ? 's' : ''} selected
                                                {selectedTreks.length === 1 && (
                                                    <span className="ml-1">
                                                        (select at least one more trek to compare)
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedTreks([])}
                                                    className="px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                                >
                                                    Clear Selection
                                                </button>
                                                <button
                                                    onClick={navigateToComparison}
                                                    disabled={selectedTreks.length < 2}
                                                    className={`px-3 py-1.5 text-sm rounded-lg ${selectedTreks.length < 2
                                                        ? 'bg-blue-300 cursor-not-allowed text-white'
                                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                        }`}
                                                >
                                                    Compare Treks
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <motion.div
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                        variants={container}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        {treks.map((trek) => (
                                            <motion.div key={trek.id} variants={item}>
                                                <TrekCard
                                                    trek={trek}
                                                    isSelectable={true}
                                                    isSelected={selectedTreks.includes(trek.id)}
                                                    onToggleSelect={handleTrekSelection}
                                                />
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
                                                            className={`px-3 py-1 border rounded-md text-sm ${currentPage === pageNum
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

export default ExplorePage;