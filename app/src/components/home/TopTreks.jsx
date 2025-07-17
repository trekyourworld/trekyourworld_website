import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TrekCard from '../ui/TrekCard';
import treksService from '../../services/api/treksService';

const TopTreks = () => {
  const [treks, setTreks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      organiser: apiTrek.org || "Unknown"
    };
  };

  useEffect(() => {
    const fetchTopTreks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await treksService.getTopTreks();
        const transformedTreks = response.data.data.map(transformApiTrek);
        setTreks(transformedTreks || []);
      } catch (err) {
        console.error('Error fetching top treks:', err);
        setError('Failed to load top treks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopTreks();
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

  if (error) {
    return (
      <section className="py-12 bg-gray-50 w-full">
        <div className="w-full px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Top Treks For This Month</h2>
          <div className="p-4 rounded-md bg-red-50 text-red-800 max-w-md mx-auto">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

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
            {treks.length > 0 ? (
              treks.map((trek) => (
                <motion.div key={trek.id} variants={item}>
                  <TrekCard trek={trek} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No featured treks available at the moment.</p>
              </div>
            )}
          </motion.div>
        )}

        <div className="text-center mt-10">
          <Link 
            to="/explore" 
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