import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TopTreks from './TopTreks';
import Statistics from './Statistics';
import PhotoGallery from './PhotoGallery';

const HomePage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-blue-700 text-white h-[70vh] min-h-[500px] flex items-center overflow-hidden w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')` 
          }}
        />
        
        <div className="w-full px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-3xl">
              Discover Breathtaking Adventures Around the World
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-xl">
              Join expert guides on unforgettable treks to the world's most stunning destinations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/treks" 
                className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-block text-center"
              >
                Explore Treks
              </Link>
              <Link 
                to="/guides" 
                className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-block text-center"
              >
                Meet Our Guides
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Top Treks Section */}
      <TopTreks />
      
      {/* Statistics Section */}
      <Statistics />
      
      {/* Photo Gallery Section */}
      <PhotoGallery />

      {/* Newsletter Section */}
      <section className="bg-blue-700 text-white py-16 w-full">
        <div className="w-full px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Get Inspired for Your Next Trek</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest trek updates, exclusive offers, and travel tips.
          </p>
          
          <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button 
              type="submit"
              className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;