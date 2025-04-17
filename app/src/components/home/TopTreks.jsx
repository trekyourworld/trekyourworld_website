import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TrekCard from '../ui/TrekCard';

// Temporary mock data - would come from an API in a real application
const mockTreks = [
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
  }
];

const TopTreks = () => {
  const [treks, setTreks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTreks(mockTreks);
      setIsLoading(false);
    }, 500);
  }, []);

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
    <section className="py-12 bg-gray-50 w-full">
      <div className="w-full px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Treks For This Month</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover this month's most popular trek destinations, handpicked by our experienced guides and loved by trekkers.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
        )}

        <div className="text-center mt-10">
          <Link 
            to="/treks" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors inline-block"
          >
            Explore All Treks
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopTreks;