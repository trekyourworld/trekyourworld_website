import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ClockIcon, MapPinIcon, StarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import { formatIndianRupees } from '../../utils/format';

const TrekCard = ({ trek }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const { 
    id, 
    name, 
    location, 
    difficulty, 
    duration, 
    rating, 
    price,
    elevation,
    organiser
  } = trek;

  const difficultyColor = {
    easy: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    difficult: 'bg-orange-100 text-orange-800',
    extreme: 'bg-red-100 text-red-800',
  };

  const getInitial = (name) => {
    if (!name) return '?';
    
    // Split by spaces and get initials of each word
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };
  
  // Function to truncate trek name if it's longer than maxLength
  const truncateName = (name, maxLength = 25) => {
    if (!name || name.length <= maxLength) return name;
    return `${name.substring(0, maxLength)}..`;
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: 'tween' }}
    >
      <div className="relative h-48 w-full">
        <div className="h-full w-full bg-blue-200 flex items-center justify-center">
          <span className="text-6xl font-bold text-blue-600">
            {getInitial(name)}
          </span>
        </div>
        <div className="absolute top-0 left-0 m-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {organiser || 'Organizer'}
          </span>
        </div>
        <div className="absolute top-0 right-0 m-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColor[difficulty.toLowerCase()]}`}>
            {difficulty}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="relative">
            <h3 
              className="text-lg font-semibold text-gray-900 mb-1 whitespace-nowrap"
              onMouseEnter={() => name.length > 25 && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {truncateName(name)}
            </h3>
            {showTooltip && name.length > 25 && (
              <div className="absolute left-0 top-full z-10 bg-gray-800 text-white text-sm py-1 px-2 rounded shadow-lg">
                {name}
              </div>
            )}
          </div>
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">{rating}</span>
          </div>
        </div>

        <div className="flex text-left items-center text-gray-500 text-sm mb-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>

        <div className="flex text-left items-center text-gray-500 text-sm mb-2">
          <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
          <span>{elevation}</span>
        </div>

        {/* <p className="text-gray-600 text-sm mb-4 text-left line-clamp-2">
          {description}
        </p> */}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{duration}</span>
          </div>
          <div className="text-blue-600 font-semibold">
            {formatIndianRupees(price)}
          </div>
        </div>

        <Link 
          to={`/trek/${id}`}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors flex justify-center items-center"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default TrekCard;