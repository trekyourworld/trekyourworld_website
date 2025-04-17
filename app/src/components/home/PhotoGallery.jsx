import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Mock data for photo gallery
const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Mountain sunrise with climber silhouette",
    location: "Mont Blanc, France",
    photographer: "Alex Johnson"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Alpine lake with mountains in background",
    location: "Banff National Park, Canada",
    photographer: "Maria Silva"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Hiker on mountain ridge at sunset",
    location: "Patagonia, Argentina",
    photographer: "Daniel Lee"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Valley view with cloud cover",
    location: "Yosemite National Park, USA",
    photographer: "Emma Thompson"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Dramatic mountain landscape with climber",
    location: "Dolomites, Italy",
    photographer: "Thomas Weber"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    alt: "Starry night over mountain peaks",
    location: "Himalayas, Nepal",
    photographer: "Sarah Chen"
  }
];

const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Trek Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the beauty of our treks through these stunning photographs captured by our community of trekkers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div 
              key={image.id}
              className="relative overflow-hidden rounded-lg shadow-md cursor-pointer aspect-[4/3]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => openLightbox(image)}
              layout
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                <p className="font-medium">{image.location}</p>
                <p className="text-sm text-gray-200">Photo by {image.photographer}</p>
              </div>
            </motion.div>
          ))}
        </div>

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
                className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
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
                  <p className="text-sm text-gray-300">{selectedImage.location} • Photo by {selectedImage.photographer}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PhotoGallery;