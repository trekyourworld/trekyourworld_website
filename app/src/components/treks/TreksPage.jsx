import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import Filters from './Filters';
import TrekCard from '../ui/TrekCard';

// Mock data for treks
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

const TreksPage = () => {
  const [allTreks, setAllTreks] = useState([]);
  const [filteredTreks, setFilteredTreks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    difficulty: [],
    duration: [],
    location: [],
    price: []
  });

  // Fetch treks data (simulated)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setAllTreks(mockTrekData);
      setFilteredTreks(mockTrekData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Apply search and filters whenever they change
  useEffect(() => {
    if (allTreks.length === 0) return;

    let results = [...allTreks];

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

    // Apply difficulty filters
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

    // Apply location filters - simplified for demo purposes
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

    setFilteredTreks(results);
  }, [searchTerm, activeFilters, allTreks]);

  // Handle search input
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle filter changes
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
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
          <p className="text-gray-600 max-w-3xl m-auto">
            Explore our collection of handpicked treks around the world. Use the search and filters to find your perfect adventure.
          </p>
        </div>
        
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <Filters onFilterChange={handleFilterChange} />
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredTreks.length === 0 ? (
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
                  price: []
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600">Showing {filteredTreks.length} treks</p>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredTreks.map((trek) => (
                <motion.div key={trek.id} variants={item}>
                  <TrekCard trek={trek} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default TreksPage;