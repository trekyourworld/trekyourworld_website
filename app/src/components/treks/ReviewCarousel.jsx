import React from 'react';
import { motion } from 'framer-motion';

// Dummy reviews for demonstration
const reviews = [
  {
    name: 'Aditi Sharma',
    insta: '@aditi.treks',
    content: 'Absolutely loved the trek! The views were breathtaking and the itinerary was well planned.'
  },
  {
    name: 'Rahul Mehra',
    insta: '@rahul.adventures',
    content: 'A challenging but rewarding experience. Highly recommend for adventure seekers!'
  },
  {
    name: 'Priya Singh',
    insta: '@priya.singh',
    content: 'The guides were knowledgeable and the group was fun. Will join again!'
  }
];

const ReviewCarousel = () => {
  const [current, setCurrent] = React.useState(0);
  const total = reviews.length;

  // Responsive: 1 on mobile, 2 on md, 3 on lg+
  const [cardsToShow, setCardsToShow] = React.useState(1);

  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setCardsToShow(3);
      } else if (window.innerWidth >= 768) {
        setCardsToShow(2);
      } else {
        setCardsToShow(1);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate which reviews to show
  const getVisibleReviews = () => {
    if (total <= cardsToShow) return reviews;
    let start = current;
    let end = start + cardsToShow;
    if (end > total) {
      // Wrap around
      return [...reviews.slice(start, total), ...reviews.slice(0, end - total)];
    }
    return reviews.slice(start, end);
  };

  const prev = () => setCurrent((prev) => (prev - cardsToShow + total) % total);
  const next = () => setCurrent((prev) => (prev + cardsToShow) % total);

  const visibleReviews = getVisibleReviews();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Reviews</h2>
        <div className="space-x-2">
          <button onClick={prev} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={next} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div className={`grid gap-4 mb-4`} style={{gridTemplateColumns: `repeat(${cardsToShow}, minmax(0, 1fr))`}}>
        {visibleReviews.map((review, idx) => (
          <motion.div
            key={review.name + review.insta}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow p-0 min-h-[120px] flex flex-col h-full"
          >
            {/* Header section */}
            <div className="bg-blue-50 rounded-t-lg px-3 py-2">
              <div className="font-bold text-blue-700 text-base text-left">{review.name}</div>
              <div className="text-blue-500 text-sm text-left">{review.insta}</div>
            </div>
            {/* Content section */}
            <div className="flex-1 p-6 flex items-start">
              <div className="text-gray-700 text-left">{review.content}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center gap-1 mt-2">
        {Array.from({length: Math.ceil(total/cardsToShow)}).map((_, idx) => (
          <span key={idx} className={`inline-block w-2 h-2 rounded-full ${(idx*cardsToShow) === current ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
        ))}
      </div>
    </div>
  );
};

export default ReviewCarousel;
