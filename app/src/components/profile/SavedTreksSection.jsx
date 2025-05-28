import { useState, useEffect } from 'react';
import TrekCard from '../ui/TrekCard';

const SavedTreksSection = ({ user }) => {
  const [savedTreks, setSavedTreks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch the user's saved treks
    const fetchSavedTreks = async () => {
      setIsLoading(true);
      try {
        // This would normally be a call to your API
        // For now, we'll use mock data
        // const response = await trekService.getSavedTreks(user.id);
        // setSavedTreks(response.data);
        
        // Mock data for demonstration
        setTimeout(() => {
          setSavedTreks([
            {
              id: '1',
              name: 'Annapurna Circuit Trek',
              location: 'Nepal',
              duration: '14-16 days',
              difficulty: 'Moderate',
              elevation: '5,416',
              distance: '160-230 km',
              price: 120000,
              rating: 4.8,
              organiser: 'Trek Your World',
              tags: ['Mountain', 'Cultural', 'Scenic Views'],
              image: 'https://images.unsplash.com/photo-1544198365-82b687cdcef6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YW5uYXB1cm5hfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60'
            },
            {
              id: '2',
              name: 'Everest Base Camp',
              location: 'Nepal',
              duration: '12-14 days',
              difficulty: 'Difficult',
              elevation: '5,364',
              distance: '130 km',
              price: 140000,
              rating: 4.9,
              organiser: 'Trek Your World',
              tags: ['Mountain', 'Iconic', 'Scenic Views'],
              image: 'https://images.unsplash.com/photo-1544198365-f5d99a578561?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZXZlcmVzdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60'
            },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load saved treks. Please try again later.');
        console.error('Error fetching saved treks:', err);
        setIsLoading(false);
      }
    };
    
    fetchSavedTreks();
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
        <p>{error}</p>
      </div>
    );
  }
  
  if (savedTreks.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Saved Treks</h3>
        </div>
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="mx-auto h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No saved treks</h3>
          <p className="mt-2 text-sm text-gray-600">You haven't saved any treks yet.</p>
          <div className="mt-6">
            <a
              href="/treks"
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Explore Treks
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Saved Treks</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full">
          {savedTreks.length} {savedTreks.length === 1 ? 'Trek' : 'Treks'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {savedTreks.map((trek) => (
          <div key={trek.id} className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <TrekCard trek={trek} />
            <button 
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-100 transition-colors duration-200"
              title="Remove from saved"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedTreksSection;