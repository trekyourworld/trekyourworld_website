import { useState, useEffect } from 'react';
import GuideCard from './GuideCard';
import GuideSearch from './GuideSearch';
import GuideFilters from './GuideFilters';
// import { useAuth } from '../auth/AuthContext';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import guidesService from '../../services/api/guidesService';
import { Helmet } from 'react-helmet-async';

// Mock data for guides - in a real app, this would be fetched from an API
// const mockGuides = [
//   {
//     id: 1,
//     name: 'Tenzing Sherpa',
//     image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=300',
//     experience: 8,
//     rating: 4.9,
//     languages: ['English', 'Nepali', 'Hindi'],
//     specializations: ['High Altitude', 'Winter Treks'],
//     availableDates: [
//       { start: '2025-05-01', end: '2025-05-15' },
//       { start: '2025-06-10', end: '2025-06-25' }
//     ],
//     supportedTreks: [
//       { id: 1, name: 'Everest Base Camp' },
//       { id: 3, name: 'Annapurna Circuit' },
//       { id: 5, name: 'Langtang Valley' }
//     ],
//     bio: 'Tenzing is an experienced mountaineer with extensive knowledge of the Himalayan region. He has led over 50 successful expeditions to Everest Base Camp.'
//   },
//   {
//     id: 2,
//     name: 'Sarah Johnson',
//     image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300',
//     experience: 5,
//     rating: 4.7,
//     languages: ['English', 'French', 'Spanish'],
//     specializations: ['Family Treks', 'Photography'],
//     availableDates: [
//       { start: '2025-05-05', end: '2025-05-20' },
//       { start: '2025-07-10', end: '2025-07-30' }
//     ],
//     supportedTreks: [
//       { id: 2, name: 'Valley of Flowers' },
//       { id: 4, name: 'Markha Valley' },
//       { id: 6, name: 'Goechala Trek' }
//     ],
//     bio: 'Sarah specializes in family-friendly treks and is an expert in adventure photography. She ensures everyone has a memorable and comfortable experience.'
//   },
//   {
//     id: 3,
//     name: 'Rajesh Thakur',
//     image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300',
//     experience: 10,
//     rating: 4.8,
//     languages: ['English', 'Hindi', 'Urdu'],
//     specializations: ['Wildlife', 'Cultural Treks'],
//     availableDates: [
//       { start: '2025-04-20', end: '2025-05-10' },
//       { start: '2025-09-15', end: '2025-10-05' }
//     ],
//     supportedTreks: [
//       { id: 7, name: 'Great Himalayan Trail' },
//       { id: 2, name: 'Valley of Flowers' },
//       { id: 8, name: 'Hampta Pass' }
//     ],
//     bio: 'Rajesh has deep knowledge of local cultures and wildlife. He is passionate about educating trekkers on conservation and local traditions.'
//   },
//   {
//     id: 4,
//     name: 'Ming Li',
//     image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300',
//     experience: 7,
//     rating: 4.6,
//     languages: ['English', 'Mandarin', 'Tibetan'],
//     specializations: ['Technical Climbing', 'Alpine Treks'],
//     availableDates: [
//       { start: '2025-06-01', end: '2025-06-20' },
//       { start: '2025-08-10', end: '2025-08-30' }
//     ],
//     supportedTreks: [
//       { id: 1, name: 'Everest Base Camp' },
//       { id: 9, name: 'Kanchenjunga Base Camp' },
//       { id: 10, name: 'Stok Kangri' }
//     ],
//     bio: 'Ming is an expert in technical climbing and Alpine trekking techniques, with experience guiding across the Himalayan and Karakoram ranges.'
//   }
// ];

const GuidesPage = () => {
//   const { isAuthenticated, loading } = useAuth();
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
    const fetchGuides = async () => {
        const guides = await guidesService.getAllGuides();
        setGuides(guides);
        setFilteredGuides(guides);
    }
    fetchGuides();
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
//   const handleSearch = (query) => {
//     setSearchQuery(query);
//   };

//   // Handler for filter changes
//   const handleFilterChange = (newFilters) => {
//     setFilters(prev => ({ ...prev, ...newFilters }));
//   };
  
  // Handle opening the sign-in modal
//   const handleSignInClick = () => {
//     // Dispatch a custom event that will be handled by Header component
//     const event = new CustomEvent('open-signin-modal');
//     window.dispatchEvent(event);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

  return (
    <>
      <Helmet>
        <title>Guides | TrekYourWorld</title>
        <meta name="description" content="Find expert trekking guides for your next adventure. Browse profiles, ratings, and specializations on TrekYourWorld." />
      </Helmet>
      <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Expert Trek Guides</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our experienced guides who will lead you through the most breathtaking trails and ensure your safety throughout your adventure.
          </p>
        </div>

       
          <div className="flex justify-center items-center min-h-[40vh]">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Guides List Coming Soon!</h2>
              <p className="text-lg text-gray-600">We are working hard to bring you our curated list of expert trek guides. Please check back shortly!</p>
            </div>
          </div>
      </div>
    </div>
    </>
  );
};

export default GuidesPage;