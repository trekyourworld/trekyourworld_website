import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Gallery images - in a real application, these would come from an API
const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Mountain sunrise with climber silhouette",
    location: "Mont Blanc, France",
    photographer: "Alex Johnson",
    category: "Mountains"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Alpine lake with mountains in background",
    location: "Banff National Park, Canada",
    photographer: "Maria Silva",
    category: "Lakes"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Hiker on mountain ridge at sunset",
    location: "Patagonia, Argentina",
    photographer: "Daniel Lee",
    category: "Hiking"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Valley view with cloud cover",
    location: "Yosemite National Park, USA",
    photographer: "Emma Thompson",
    category: "Valleys"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Dramatic mountain landscape with climber",
    location: "Dolomites, Italy",
    photographer: "Thomas Weber",
    category: "Mountains"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Starry night over mountain peaks",
    location: "Himalayas, Nepal",
    photographer: "Sarah Chen",
    category: "Night"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1476611338391-6f395a0dd82e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Campsite with tent overlooking mountains",
    location: "Rocky Mountains, USA",
    photographer: "James Wilson",
    category: "Camping"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1445452916036-9022dfd33aa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Mountain summit achievement",
    location: "Mount Kilimanjaro, Tanzania",
    photographer: "Robert Brown",
    category: "Summit"
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Forest trail through misty woods",
    location: "Pacific Northwest, USA",
    photographer: "Lisa Green",
    category: "Forests"
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Waterfall in tropical rainforest",
    location: "Bali, Indonesia",
    photographer: "Michael Chang",
    category: "Waterfalls"
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Mountain path through wildflowers",
    location: "Swiss Alps, Switzerland",
    photographer: "Hannah Fischer",
    category: "Flowers"
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1515036551567-bf1198cccc35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Sunrise from mountain summit",
    location: "Mount Fuji, Japan",
    photographer: "Akira Tanaka",
    category: "Sunrise"
  }
];

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredImages, setFilteredImages] = useState(galleryImages);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // Extract unique categories for filters
  const categories = ['All', ...new Set(galleryImages.map(img => img.category))];

  useEffect(() => {
    // Apply both category filter and search query filter
    let results = galleryImages;
    
    // First filter by category
    if (activeFilter !== 'All') {
      results = results.filter(img => img.category === activeFilter);
    }
    
    // Then filter by search query if it exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(img => 
        img.alt.toLowerCase().includes(query) || 
        img.location.toLowerCase().includes(query) || 
        img.photographer.toLowerCase().includes(query) || 
        img.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredImages(results);
  }, [activeFilter, searchQuery]);

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };
  
  // Add keyboard shortcut to focus search (press '/')
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus search input when '/' is pressed
      if (e.key === '/' && searchInputRef.current && !selectedImage) {
        e.preventDefault(); // Prevent '/' from being typed in the input
        searchInputRef.current.focus();
      }
      
      // Close lightbox when ESC is pressed
      if (e.key === 'Escape' && selectedImage) {
        closeLightbox();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg mb-8">
            Discover real moments from treks and mountains worldwide, shared by independent trekkers and guides. Get inspired for your next adventure with authentic, unbiased glimpses from the trail—TrekYourWorld is your trusted information source, not a trekking company.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by location, photographer, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
                aria-label="Search gallery"
              />
              {searchQuery && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded-md text-gray-700">/</kbd> to search
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Results summary */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <p className="text-gray-600 mb-3 sm:mb-0">
            Showing <span className="font-medium">{filteredImages.length}</span> {filteredImages.length === 1 ? 'photo' : 'photos'}
            {activeFilter !== 'All' ? ` in category "${activeFilter}"` : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </p>
          
          {(activeFilter !== 'All' || searchQuery) && (
            <button 
              onClick={() => {
                setActiveFilter('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => openLightbox(image)}
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="font-medium text-sm">{image.alt}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{image.location}</h3>
                <p className="text-gray-600 text-sm">Photo by {image.photographer}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                  {image.category}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600 mb-2">No images found {searchQuery ? "matching your search" : "for this category"}.</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear Search
                </button>
              )}
              {activeFilter !== 'All' && (
                <button 
                  onClick={() => setActiveFilter('All')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All Photos
                </button>
              )}
            </div>
          </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              <motion.button
                className="absolute top-6 right-6 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.button>

              <motion.div 
                className="relative max-w-5xl max-h-[90vh]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={selectedImage.src} 
                  alt={selectedImage.alt} 
                  className="max-w-full max-h-[80vh] rounded-lg object-contain"
                />
                <div className="bg-black/50 p-4 rounded-b-lg text-white">
                  <p className="text-lg font-medium">{selectedImage.alt}</p>
                  <p className="text-sm text-gray-300">
                    {selectedImage.location} • Photo by {selectedImage.photographer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GalleryPage;
