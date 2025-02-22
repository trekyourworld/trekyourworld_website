import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Trek } from '../../types';

const Explore: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
      difficulty: '',
      duration: '',
      season: '',
      priceRange: '',
    });
  
    // Sample trek data
    const treks: Trek[] = [
      {
        id: 1,
        name: "Valley of Flowers Trek",
        location: "Uttarakhand, India",
        difficulty: "Moderate",
        duration: 6,
        distance: 38,
        elevation: 3658,
        season: ["July", "August", "September"],
        price: 8999,
        rating: 4.8,
        imageUrl: "/api/placeholder/400/250",
        description: "A UNESCO World Heritage site famous for its meadows of endemic alpine flowers."
      },
      {
        id: 2,
        name: "Everest Base Camp",
        location: "Nepal",
        difficulty: "Difficult",
        duration: 14,
        distance: 130,
        elevation: 5364,
        season: ["March", "April", "May", "September", "October", "November"],
        price: 24999,
        rating: 4.9,
        imageUrl: "/api/placeholder/400/250",
        description: "Classic trek to the base of the world's highest mountain."
      },
      // Add more trek data as needed
    ];
  
    const handleFilterChange = (filterName: string, value: string) => {
      setFilters(prev => ({
        ...prev,
        [filterName]: value
      }));
    };
  
    const filteredTreks = treks.filter(trek => {
      const matchesSearch = trek.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trek.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDifficulty = !filters.difficulty || trek.difficulty === filters.difficulty;
      const matchesDuration = !filters.duration || trek.duration <= parseInt(filters.duration);
      const matchesSeason = !filters.season || trek.season.includes(filters.season);
      const matchesPrice = !filters.priceRange || trek.price <= parseInt(filters.priceRange);
  
      return matchesSearch && matchesDifficulty && matchesDuration && matchesSeason && matchesPrice;
    });
  
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Section */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <input
                  type="text"
                  placeholder="Search treks by name or location..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
  
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Section */}
              <div className="lg:w-1/4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">Filters</h2>
                  
                  {/* Difficulty Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={filters.difficulty}
                      onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    >
                      <option value="">All Difficulties</option>
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Difficult">Difficult</option>
                      <option value="Extreme">Extreme</option>
                    </select>
                  </div>
  
                  {/* Duration Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Duration (days)
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={filters.duration}
                      onChange={(e) => handleFilterChange('duration', e.target.value)}
                    >
                      <option value="">Any Duration</option>
                      <option value="3">Up to 3 days</option>
                      <option value="7">Up to 7 days</option>
                      <option value="14">Up to 14 days</option>
                      <option value="30">Up to 30 days</option>
                    </select>
                  </div>
  
                  {/* Season Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Season
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={filters.season}
                      onChange={(e) => handleFilterChange('season', e.target.value)}
                    >
                      <option value="">Any Season</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                      <option value="Autumn">Autumn</option>
                      <option value="Winter">Winter</option>
                    </select>
                  </div>
  
                  {/* Price Range Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={filters.priceRange}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    >
                      <option value="">Any Price</option>
                      <option value="5000">Under ₹5,000</option>
                      <option value="10000">Under ₹10,000</option>
                      <option value="20000">Under ₹20,000</option>
                      <option value="50000">Under ₹50,000</option>
                    </select>
                  </div>
                </div>
              </div>
  
              {/* Trek Listings */}
              <div className="lg:w-3/4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTreks.map((trek) => (
                    <div key={trek.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <img
                        src={trek.imageUrl}
                        alt={trek.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">{trek.name}</h3>
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                            {trek.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{trek.location}</p>
                        <div className="flex items-center mb-4">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{trek.rating}</span>
                        </div>
                        <p className="text-gray-700 mb-4 line-clamp-2">{trek.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{trek.duration} days</span>
                            <span className="text-sm text-gray-600">{trek.distance} km</span>
                          </div>
                          <div className="text-lg font-semibold text-blue-600">
                            ₹{trek.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
};

export default Explore
;