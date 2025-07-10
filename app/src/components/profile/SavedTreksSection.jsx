import { useState, useEffect } from 'react';
import TrekCard from '../ui/TrekCard';
import { getDetailedBookmarks } from '../../services/api/bookmarksService';
import { transformApiTrek } from '../../utils/utils'; // Adjust the import path as necessary

const SavedTreksSection = ({ user }) => {
    const [savedTreks, setSavedTreks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSavedTreks = async () => {
            setIsLoading(true);
            try {
                const response = await getDetailedBookmarks();
                console.log(response.data.data.bookmarks)
                const transformedTreks = response.data.data.bookmarks.map(transformApiTrek);

                setSavedTreks(transformedTreks);
                // If API returns data in response.data, adjust accordingly
                // setSavedTreks(response.data.data.bookmarks || []);
            } catch (err) {
                setError('Failed to load saved treks. Please try again later.');
                console.error('Error fetching saved treks:', err);
            } finally {
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
                            href="/explore"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {savedTreks.map((trek) => (
                    <div key={trek.id} className="relative">
                        <TrekCard trek={trek} />
                        {/* Remove button can be implemented here if needed */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedTreksSection;