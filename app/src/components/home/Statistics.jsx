import { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  MapIcon, 
  UserGroupIcon, 
  GlobeAsiaAustraliaIcon 
} from '@heroicons/react/24/outline';
import { statsService } from '../../services/api/index';

// Fallback data in case the API call fails
const fallbackStats = {
  treks: 120,
  guides: 45,
  locations: 28
};

const Statistics = () => {
  const [stats, setStats] = useState({
    treks: 0,
    guides: 0,
    locations: 0
  });
  
  const [targetStats, setTargetStats] = useState(fallbackStats);
  const [inView, setInView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch statistics from the API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsService.getStats();
        if (response.data && response.data.data) {
          setTargetStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load statistics');
        // Use fallback data on error
        setTargetStats(fallbackStats);
      } finally {
        setLoading(false);
        // Trigger the animation after we have the data
        setInView(true);
      }
    };
    
    fetchStats();
  }, []);

  useEffect(() => {
    if (!inView) return;

    // Animate the count up
    const duration = 2000; // 2 seconds
    const interval = 20;
    const steps = duration / interval;

    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep += 1;
      const progress = currentStep / steps;
      
      setStats({
        treks: Math.floor(progress * targetStats.treks),
        guides: Math.floor(progress * targetStats.guides),
        locations: Math.floor(progress * targetStats.locations),
      });

      if (currentStep >= steps) {
        setStats(targetStats);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [inView, targetStats]);

  const statItems = [
    {
      name: "Peaks, Treks & Hikes",
      value: stats.treks,
      icon: MapIcon,
      description: "Documented mountain peaks, treks, and hiking routes",
      color: "bg-blue-100 text-blue-600"
    },
    {
      name: "Mountain Experts",
      value: stats.guides,
      icon: UserGroupIcon,
      description: "Verified guides and mountaineering professionals",
      color: "bg-green-100 text-green-600"
    },
    {
      name: "Regions Covered",
      value: stats.locations,
      icon: GlobeAsiaAustraliaIcon,
      description: "Countries and regions with detailed mountain info",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Mountain Footprint</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            TrekYourWorld is your trusted source for all things mountains. From the highest summits to hidden trails, our growing database and expert network help you explore, plan, and conquer your next adventure with confidence.
          </p>
        </div>

        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {statItems.map((item) => (
              <motion.div
                key={item.name}
                className="bg-white rounded-xl shadow-md p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <div className={`inline-flex p-3 rounded-full ${item.color} mb-4`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {loading ? '...' : `${item.value}+`}
                </h3>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h4>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Statistics;