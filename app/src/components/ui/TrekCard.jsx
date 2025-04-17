import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ClockIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/solid';

const TrekCard = ({ trek }) => {
  const { 
    id, 
    name, 
    location, 
    difficulty, 
    duration, 
    rating, 
    price, 
    description 
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
        <div className="absolute top-0 right-0 m-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColor[difficulty.toLowerCase()]}`}>
            {difficulty}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">{rating}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{duration}</span>
          </div>
          <div className="text-blue-600 font-semibold">
            ${price}
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