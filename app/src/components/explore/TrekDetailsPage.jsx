import { useState, useEffect } from 'react';
import { bookmarksService } from '../../services/api/bookmarksService';
import { useAuth } from '../auth/AuthContext';
import SignInModal from '../auth/SignInModal';
import { useParams, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { StarIcon, MapPinIcon, ClockIcon, ArrowTrendingUpIcon, TagIcon } from '@heroicons/react/24/solid';
import { treksService } from '../../services/api/treksService';
import ImageCarousel from './ImageCarousel';
import ReviewCarousel from './ReviewCarousel';

const TrekDetailsPage = () => {
    const { id } = useParams();
    const [trek, setTrek] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAuthenticated } = useAuth();
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [bookmarkError, setBookmarkError] = useState('');
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Fetch bookmarks for the user and check if this trek is already bookmarked
    useEffect(() => {
        const checkBookmarked = async () => {
            if (isAuthenticated && trek && trek.id) {
                try {
                    const res = await bookmarksService.getBookmarks();
                    // Assume res.data is an array of bookmarked trek IDs or objects with trekId
                    const bookmarkData = res.data || [];
                    // Support both [{trekId: '...'}] and ['...'] formats
                    const ids = bookmarkData.data['bookmarks'].map(b => b.mountain_id);
                    setIsBookmarked(ids.includes(trek.id));
                } catch (e) {
                    console.error('Error fetching bookmarks:', e);
                    setIsBookmarked(false);
                }
            } else {
                setIsBookmarked(false);
            }
        };
        checkBookmarked();
    }, [isAuthenticated, trek]);

    useEffect(() => {
        const fetchTrekDetails = async () => {
            setIsLoading(true);
            try {
                const response = await treksService.getTrekById(id);
                if (response.data && response.data.data) {
                    // Transform API data to match our component's format
                    const apiTrek = response.data.data;
                    setTrek({
                        id: apiTrek.uuid,
                        name: apiTrek.title,
                        image: `https://images.unsplash.com/photo-1515876305430-f06edab8282a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80`, // Default image as API doesn't provide one
                        location: apiTrek.location || "Unknown",
                        difficulty: Array.isArray(apiTrek.difficulty) ? apiTrek.difficulty[0] : "Moderate",
                        duration: apiTrek.duration ? `${apiTrek.duration} days` : "Unknown",
                        rating: 4.5, // Default rating as API doesn't provide one
                        price: apiTrek.cost ? parseInt(apiTrek.cost.replace(',', '')) : 999,
                        description: apiTrek.description || `Trek to ${apiTrek.title} - Elevation: ${apiTrek.elevation || 'N/A'}`,
                        elevation: apiTrek.elevation,
                        organiser: apiTrek.org || "Unknown",
                        bestTimeToVisit: apiTrek.bestTimeToTarget || [],
                        distance: apiTrek.distance || "N/A",
                        tags: apiTrek.tags || [],
                        url: apiTrek.url || null,
                        itinerary: apiTrek.itinerary
                            ? {
                                ...apiTrek.itinerary,
                                stops: apiTrek.itinerary.stops?.map((stop) => ({
                                    ...stop,
                                    elevation_gain: stop.elevation_gain ?? stop.elevationGain ?? 0,
                                    elevation_loss: stop.elevation_loss ?? stop.elevationLoss ?? 0,
                                    current_elevation: stop.current_elevation ?? stop.currentElevation ?? 0,
                                })) || [],
                            }
                            : null, // Add itinerary to trek state
                        organisers: apiTrek.organisers || [],
                    });
                    setError(null);
                } else {
                    throw new Error('Invalid data format from API');
                }
            } catch (err) {
                console.error('Error fetching trek details:', err);
                setError('Failed to load trek details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchTrekDetails();
        }
    }, [id]);

    const difficultyColor = {
        easy: 'bg-green-100 text-green-800',
        moderate: 'bg-yellow-100 text-yellow-800',
        difficult: 'bg-orange-100 text-orange-800',
        extreme: 'bg-red-100 text-red-800',
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-[70vh]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <Link to="/treks" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mt-4">
                        Back to Treks
                    </Link>
                </div>
            </div>
        );
    }

    if (!trek) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">Trek not found. It may have been removed or the ID is invalid.</p>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <Link to="/treks" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mt-4">
                        Back to Treks
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="bg-gray-50 min-h-screen py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center mb-6 text-sm">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <Link to="/treks" className="text-gray-500 hover:text-gray-700">Treks</Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-700">{trek.name}</span>
                </div>

                {/* Main content */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    {/* Hero section with image and title */}
                    {/* Hero section with image carousel and title */}
                    <div className="relative h-96 w-full bg-gray-200">
                        {/* Carousel of images */}
                        <ImageCarousel id={trek.id} name={trek.name} />
                    </div>

                    {/* Trek name below hero section */}
                    <div className="px-6 py-4 bg-white">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-left">{trek.name}</h1>
                    </div>


                    {/* Trek info section */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left column with details */}
                            <div className="lg:col-span-2">
                                {/* Key details cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    {/* Difficulty card */}
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Difficulty</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColor[trek.difficulty.toLowerCase()]}`}>
                                                {trek.difficulty}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Duration card */}
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Duration</span>
                                            <div className="flex items-center">
                                                <ClockIcon className="h-4 w-4 text-blue-500 mr-1" />
                                                <span className="text-sm font-medium">{trek.duration}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Elevation card */}
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Elevation</span>
                                            <div className="flex items-center">
                                                <ArrowTrendingUpIcon className="h-4 w-4 text-blue-500 mr-1" />
                                                <span className="text-sm font-medium">{(trek.elevation && !isNaN(trek.elevation)) ? (trek.elevation * 0.3048).toFixed(0) : 'N/A'} m</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Distance card */}
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Distance</span>
                                            <span className="text-sm font-medium">{trek.distance} km</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description section */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4 text-left">About this Trek</h2>
                                    <p className="text-gray-600 leading-relaxed text-left">{trek.description}</p>
                                </div>

                                {/* Best time to visit section */}
                                {trek.bestTimeToVisit && trek.bestTimeToVisit.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-xl text-left font-semibold text-gray-800 mb-4">Best Time to Visit</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {trek.bestTimeToVisit.map((month, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-lg"
                                                >
                                                    {month}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Itinerary section */}
                                {trek.itinerary && trek.itinerary.stops && trek.itinerary.stops.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-left">Itinerary</h2>
                                        <div className="bg-white rounded-lg shadow p-4">
                                            <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4">
                                                <span className="text-sm text-gray-600 font-medium">Start: <span className="font-semibold text-blue-700">{trek.itinerary.start}</span></span>
                                                <span className="hidden md:inline-block text-gray-400">→</span>
                                                <span className="text-sm text-gray-600 font-medium">End: <span className="font-semibold text-blue-700">{trek.itinerary.end}</span></span>
                                            </div>
                                            <ol className="relative border-l-2 border-blue-200 ml-2">
                                                {trek.itinerary.stops.map((stop, idx) => (
                                                    <li key={idx} className="mb-8 ml-4 text-left">
                                                        <div className="absolute w-3 h-3 bg-blue-500 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                                        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                                            <span className="text-blue-700 font-bold text-lg md:w-auto w-full md:text-left">Day {stop.day}</span>
                                                            <span className="text-gray-800 font-semibold text-md w-full text-left md:text-left md:w-auto block">{stop.title}</span>
                                                        </div>
                                                        <p className="text-gray-600 mt-1 mb-2 text-sm">{stop.description}</p>
                                                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                                            <span>Distance: <span className="font-medium text-gray-700">{stop.distance} km</span></span>
                                                            <span className="flex items-center gap-1">
                                                                <ArrowTrendingUpIcon className="h-4 w-4 text-green-700 inline" />
                                                                Elevation Gain: <span className="font-medium text-green-700">{(stop.elevation_gain && !isNaN(stop.elevation_gain)) ? (stop.elevation_gain * 0.3048).toFixed(0) : '0'} m</span>
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <ArrowTrendingUpIcon className="h-4 w-4 text-red-700 inline rotate-180" />
                                                                Elevation Loss: <span className="font-medium text-red-700">{(stop.elevation_loss && !isNaN(stop.elevation_loss)) ? (stop.elevation_loss * 0.3048).toFixed(0) : '0'} m</span>
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <ArrowTrendingUpIcon className="h-4 w-4 text-blue-700 inline" />
                                                                Current Elevation: <span className="font-medium text-blue-700">{(stop.current_elevation && !isNaN(stop.current_elevation)) ? (stop.current_elevation * 0.3048).toFixed(0) : '0'} m</span>
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                )}
                                {/* Review carousel section */}
                                <div className="mb-8">
                                    <ReviewCarousel />
                                </div>

                                {/* External link if available */}
                                {trek.url && (
                                    <div className="mt-8">
                                        <a
                                            href={trek.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline flex items-center"
                                        >
                                            <span>Visit official page for more details</span>
                                            <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Right column with booking details */}
                            <div>
                                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Trip Details</h2>

                                    {/* Price */}
                                    {/* <div className="mb-6">
                    <span className="text-gray-500 text-sm text-left">Price</span>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900">{formatIndianRupees(trek.price)}</span>
                      <span className="text-sm text-gray-500 ml-1">per person</span>
                    </div>
                  </div> */}

                                    {/* Rating */}
                                    <div className="mb-6">
                                        <div className="flex items-center">
                                            <span className="text-gray-500 text-sm mr-2">Rating</span>
                                            <div className="flex items-center">
                                                <StarIcon className="h-5 w-5 text-yellow-400" />
                                                <span className="ml-1 text-gray-700">{trek.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="mb-6">
                                        <span className="text-gray-500 text-sm text-left">Location</span>
                                        <div className="flex items-center mt-1">
                                            <MapPinIcon className="h-5 w-5 text-red-500 mr-2" />
                                            <span className="text-gray-700">{trek.location}</span>
                                        </div>
                                    </div>

                                    {/* Organisers list */}
                                    {Array.isArray(trek.organisers) && trek.organisers.length > 0 && (
                                        <div className="mb-6 text-left">
                                            <span className="text-gray-500 text-sm text-left block mb-1">Organisers</span>
                                            <ul className="list-disc list-inside ml-2">
                                                {trek.organisers.map((org, idx) => (
                                                    <li key={idx} className="text-gray-700 text-sm">
                                                        {org.website ? (
                                                            <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{org.name}</a>
                                                        ) : (
                                                            org.name
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="space-y-3">
                                        <button
                                            className={`w-full font-medium py-3 px-4 rounded-lg border transition-colors flex items-center justify-center gap-2 disabled:opacity-60 
                                                    ${isBookmarked ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                                    : 'bg-white hover:bg-gray-50 text-blue-600 border-blue-600'}`}
                                            onClick={async () => {
                                                setBookmarkError('');
                                                if (!isAuthenticated) {
                                                    setShowSignInModal(true);
                                                } else {
                                                    if (!trek) return;
                                                    setBookmarkLoading(true);
                                                    try {
                                                        if (!isBookmarked) {
                                                            await bookmarksService.addBookmark(trek.id);
                                                            setIsBookmarked(true);
                                                        } else {
                                                            await bookmarksService.removeBookmark(trek.id);
                                                            setIsBookmarked(false);
                                                        }
                                                    } catch (err) {
                                                        console.error('Error updating bookmark:', err);
                                                        setBookmarkError('Failed to update bookmark. Please try again.');
                                                    } finally {
                                                        setBookmarkLoading(false);
                                                    }
                                                }
                                            }}
                                            disabled={bookmarkLoading}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75v12l-5.25-3-5.25 3v-12A2.25 2.25 0 009 4.5h6a2.25 2.25 0 012.25 2.25z" />
                                            </svg>
                                            {bookmarkLoading
                                                ? (isBookmarked ? 'Removing...' : 'Saving...')
                                                : isBookmarked
                                                    ? 'Bookmarked!'
                                                    : 'Bookmark'}
                                        </button>
                                        {bookmarkError && (
                                            <div className="text-red-600 text-sm mt-2">{bookmarkError}</div>
                                        )}
                                        <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
                                    </div>
                                </div>

                                {/* Tags section */}
                                {trek.tags && trek.tags.length > 0 && (
                                    <div className="mb-8">
                                        <div className="flex items-center mb-4">
                                            <TagIcon className="h-5 w-5 text-gray-500 mr-2" />
                                            <h2 className="text-xl font-semibold text-gray-800">Tags</h2>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {trek.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-lg"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related treks section placeholder */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Treks You May Like</h2>
                    <p className="text-gray-600">This feature is coming soon.</p>
                </div>

                {/* Back to all treks button */}
                <div className="text-center mb-8">
                    <Link
                        to="/treks"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to All Treks
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default TrekDetailsPage;
