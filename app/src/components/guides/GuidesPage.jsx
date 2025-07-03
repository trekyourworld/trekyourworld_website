import { useState, useEffect } from 'react';
import GuideCard from './GuideCard';
import GuideSearch from './GuideSearch';
import GuideFilters from './GuideFilters';
import { useAuth } from '../auth/AuthContext';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// Mock data for guides - in a real app, this would be fetched from an API
const mockGuides = [
  {
    id: 1,
    name: 'Tenzing Sherpa',
    image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=300',
    experience: 8,
    rating: 4.9,
    languages: ['English', 'Nepali', 'Hindi'],
    specializations: ['High Altitude', 'Winter Treks'],
    availableDates: [
      { start: '2025-05-01', end: '2025-05-15' },
      { start: '2025-06-10', end: '2025-06-25' }
    ],
    supportedTreks: [
      { id: 1, name: 'Everest Base Camp' },
      { id: 3, name: 'Annapurna Circuit' },
      { id: 5, name: 'Langtang Valley' }
    ],
    bio: 'Tenzing is an experienced mountaineer with extensive knowledge of the Himalayan region. He has led over 50 successful expeditions to Everest Base Camp.'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300',
    experience: 5,
    rating: 4.7,
    languages: ['English', 'French', 'Spanish'],
    specializations: ['Family Treks', 'Photography'],
    availableDates: [
      { start: '2025-05-05', end: '2025-05-20' },
      { start: '2025-07-10', end: '2025-07-30' }
    ],
    supportedTreks: [
      { id: 2, name: 'Valley of Flowers' },
      { id: 4, name: 'Markha Valley' },
      { id: 6, name: 'Goechala Trek' }
    ],
    bio: 'Sarah specializes in family-friendly treks and is an expert in adventure photography. She ensures everyone has a memorable and comfortable experience.'
  },
  {
    id: 3,
    name: 'Rajesh Thakur',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300',
    experience: 10,
    rating: 4.8,
    languages: ['English', 'Hindi', 'Urdu'],
    specializations: ['Wildlife', 'Cultural Treks'],
    availableDates: [
      { start: '2025-04-20', end: '2025-05-10' },
      { start: '2025-09-15', end: '2025-10-05' }
    ],
    supportedTreks: [
      { id: 7, name: 'Great Himalayan Trail' },
      { id: 2, name: 'Valley of Flowers' },
      { id: 8, name: 'Hampta Pass' }
    ],
    bio: 'Rajesh has deep knowledge of local cultures and wildlife. He is passionate about educating trekkers on conservation and local traditions.'
  },
  {
    id: 4,
    name: 'Ming Li',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300',
    experience: 7,
    rating: 4.6,
    languages: ['English', 'Mandarin', 'Tibetan'],
    specializations: ['Technical Climbing', 'Alpine Treks'],
    availableDates: [
      { start: '2025-06-01', end: '2025-06-20' },
      { start: '2025-08-10', end: '2025-08-30' }
    ],
    supportedTreks: [
      { id: 1, name: 'Everest Base Camp' },
      { id: 9, name: 'Kanchenjunga Base Camp' },
      { id: 10, name: 'Stok Kangri' }
    ],
    bio: 'Ming is an expert in technical climbing and Alpine trekking techniques, with experience guiding across the Himalayan and Karakoram ranges.'
  }
];

const GuidesPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    specializations: [],
    languages: [],
    experience: 0,
    availableDate: null,
    trek: ''
  });

  // Load guides data
  useEffect(() => {
    // In a real application, this would be an API call
    setGuides(mockGuides);
    setFilteredGuides(mockGuides);
  }, []);

  // Apply search and filters whenever they change
  useEffect(() => {
    let results = [...guides];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(guide => 
        guide.name.toLowerCase().includes(query) || 
        guide.bio.toLowerCase().includes(query) ||
        guide.specializations.some(spec => spec.toLowerCase().includes(query))
      );
    }
    
    // Apply filters
    if (filters.specializations.length > 0) {
      results = results.filter(guide => 
        guide.specializations.some(spec => 
          filters.specializations.includes(spec)
        )
      );
    }
    
    if (filters.languages.length > 0) {
      results = results.filter(guide => 
        guide.languages.some(lang => 
          filters.languages.includes(lang)
        )
      );
    }
    
    if (filters.experience > 0) {
      results = results.filter(guide => guide.experience >= filters.experience);
    }
    
    if (filters.availableDate) {
      const filterDate = new Date(filters.availableDate);
      results = results.filter(guide => 
        guide.availableDates.some(dateRange => {
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);
          return filterDate >= startDate && filterDate <= endDate;
        })
      );
    }
    
    if (filters.trek) {
      results = results.filter(guide => 
        guide.supportedTreks.some(trek => 
          trek.name.toLowerCase().includes(filters.trek.toLowerCase())
        )
      );
    }
    
    setFilteredGuides(results);
  }, [searchQuery, filters, guides]);

  // Handler for search queries
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handler for filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Handle opening the sign-in modal
  const handleSignInClick = () => {
    // Dispatch a custom event that will be handled by Header component
    const event = new CustomEvent('open-signin-modal');
    window.dispatchEvent(event);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Expert Trek Guides</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our experienced guides who will lead you through the most breathtaking trails and ensure your safety throughout your adventure.
          </p>
        </div>

        {!isAuthenticated ? (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8 mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In to View Our Guides</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Please sign in to browse our expert trek guides and find your perfect match for your next adventure.
            </p>
            <button
              onClick={handleSignInClick}
              className="flex items-center mx-auto bg-white border border-gray-300 rounded-md shadow-sm px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Continue with Google
            </button>
          </motion.div>
        ) : (
          <>
            {/* Search and filters section */}
            <div className="mb-10">
              <div className="bg-white rounded-lg shadow-md p-6">
                <GuideSearch onSearch={handleSearch} />
                <GuideFilters onFilterChange={handleFilterChange} />
              </div>
            </div>
            
            {/* Results count */}
            <div className="mb-6">
              <p className="text-gray-600 font-medium">
                {filteredGuides.length} {filteredGuides.length === 1 ? 'guide' : 'guides'} found
              </p>
            </div>

            {/* Guide cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGuides.length > 0 ? (
                filteredGuides.map(guide => (
                  <GuideCard 
                    key={guide.id} 
                    guide={guide} 
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-xl text-gray-500">No guides match your search criteria. Please try different filters.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GuidesPage;