// Simple image carousel for hero section
import React, { useRef, useState, useEffect } from 'react';

const ImageCarousel = function ImageCarousel({ id, name }) {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Simulate loading images from an endpoint using id
  useEffect(() => {
    async function fetchImages() {
      // Dummy images for now, could use id in a real API call
      const dummy = [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1000&q=80',
      ];
      await new Promise((res) => setTimeout(res, 500));
      setImages(dummy);
    }
    fetchImages();
  }, [id]);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearTimeout(timeoutRef.current);
  }, [current, images]);

  if (!images || images.length === 0) {
    return (
      <div className="h-full w-full bg-blue-200 flex items-center justify-center">
        <span className="text-9xl font-bold text-blue-600">{name.charAt(0).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Fullscreen image view */}
      {fullscreenImage !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black">
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-xl font-bold z-[60]"
            onClick={() => setFullscreenImage(null)}
            aria-label="Close fullscreen"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Previous button */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white hover:text-gray-200 rounded-full p-2"
            onClick={() => setFullscreenImage((fullscreenImage - 1 + images.length) % images.length)}
            aria-label="Previous image"
          >
            <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Next button */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white hover:text-gray-200 rounded-full p-2"
            onClick={() => setFullscreenImage((fullscreenImage + 1) % images.length)}
            aria-label="Next image"
          >
            <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Current image */}
          <img 
            src={images[fullscreenImage]} 
            alt={`Trek image ${fullscreenImage + 1}`} 
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          
          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            {fullscreenImage + 1} / {images.length}
          </div>
        </div>
      )}
      
      {/* Modal for all images */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl h-[80vh] p-6 relative flex flex-col">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">All Images</h2>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 content-start">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="rounded-lg overflow-hidden shadow border border-gray-100 bg-white flex flex-col h-auto cursor-pointer" 
                    onClick={() => setFullscreenImage(idx)}
                  >
                    <img src={img} alt={`Trek image ${idx + 1}`} className="w-full h-48 object-cover" />
                    <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-200">
                      <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M7 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zm6 0a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM4 4a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v10h8V4H6z" /></svg>
                      <span className="text-xs text-gray-600">&copy; Owner Name</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top right button to open modal */}
      {images.length > 0 && (
        <button
          className="absolute top-3 right-3 z-30 bg-white/80 hover:bg-white text-gray-800 rounded-lg px-3 py-1 shadow text-sm font-medium border border-gray-200"
          onClick={() => setShowModal(true)}
        >
          View All
        </button>
      )}

      {/* Left button */}
      {images.length > 1 && (
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-gray-800 rounded-full p-2 shadow transition-colors"
          onClick={() => setCurrent((current - 1 + images.length) % images.length)}
          aria-label="Previous image"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
      )}
      {/* Right button */}
      {images.length > 1 && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-gray-800 rounded-full p-2 shadow transition-colors"
          onClick={() => setCurrent((current + 1) % images.length)}
          aria-label="Next image"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      )}
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={name}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          style={{ pointerEvents: idx === current ? 'auto' : 'none' }}
        />
      ))}
      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? 'bg-white' : 'bg-gray-400'} border border-gray-300`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;