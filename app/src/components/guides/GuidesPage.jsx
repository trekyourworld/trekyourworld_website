import { useState, useEffect } from 'react';
import GuideCard from './GuideCard';
import GuideSearch from './GuideSearch';
import GuideFilters from './GuideFilters';

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
      </div>
    </div>
  );
};

export default GuidesPage;