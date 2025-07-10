import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, MapIcon, TrashIcon, StarIcon, MapPinIcon, CalendarIcon, ExclamationTriangleIcon, InformationCircleIcon, CurrencyRupeeIcon, ClockIcon, ArrowTrendingUpIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid';
import { treksService } from '../../services/api/treksService';
import { formatIndianRupees } from '../../utils/format';

const CompareTreksPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [compareTreks, setCompareTreks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTreks = async () => {
            setIsLoading(true);
            try {
                // Get trek IDs from URL search params
                const searchParams = new URLSearchParams(location.search);
                const trekIds = searchParams.get('ids')?.split(',') || [];

                if (trekIds.length < 2) {
                    setError('Please select at least 2 treks to compare.');
                    setIsLoading(false);
                    return;
                }

                // Fetch details for each trek
                const trekDetailsPromises = trekIds.map(id => treksService.getTrekById(id));
                const responses = await Promise.all(trekDetailsPromises);

                // Process the trek data
                const treksData = responses.map(response => {
                    const apiTrek = response.data.data;
                    return {
                        id: apiTrek.uuid,
                        name: apiTrek.title,
                        image: `https://images.unsplash.com/photo-1515876305430-f06edab8282a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80`,
                        location: apiTrek.location || "Unknown",
                        difficulty: Array.isArray(apiTrek.difficulty) ? apiTrek.difficulty[0] : "Moderate",
                        duration: apiTrek.duration ? `${apiTrek.duration} days` : "Unknown",
                        rating: 4.5,
                        price: apiTrek.cost ? parseInt(apiTrek.cost.replace(',', '')) : 999,
                        description: apiTrek.description || `Trek to ${apiTrek.title}`,
                        elevation: apiTrek.elevation || "N/A",
                        organiser: apiTrek.org || "Unknown",
                        bestTimeToVisit: apiTrek.bestTimeToTarget || [],
                        distance: apiTrek.distance || "N/A",
                        tags: apiTrek.tags || []
                    };
                });

                setCompareTreks(treksData);
                setError(null);
            } catch (err) {
                console.error('Error fetching trek details for comparison:', err);
                setError('Failed to load trek details for comparison. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTreks();
    }, [location.search]);

    const removeTrekFromComparison = (idToRemove) => {
        const updatedTreks = compareTreks.filter(trek => trek.id !== idToRemove);

        if (updatedTreks.length < 2) {
            // If less than 2 treks remain, navigate back to treks page
            navigate('/treks');
            return;
        }

        // Update URL with remaining trek IDs
        const updatedIds = updatedTreks.map(trek => trek.id).join(',');
        navigate(`/compare-treks?ids=${updatedIds}`);

        // Update state
        setCompareTreks(updatedTreks);
    };

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

    // Calculate column width - first column is feature names (20%), rest are divided equally
    const trekColumnWidth = compareTreks.length ? `${80 / compareTreks.length}%` : '40%';

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Compare Treks</h1>
                    <Link
                        to="/treks"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Treks
                    </Link>
                </div>

                <p className="text-gray-600 mb-4">
                    Compare the features and details of different treks side by side to help you make the best choice for your adventure.
                </p>
            </div>

            <div className="overflow-x-auto">
                <div style={{ minWidth: `${Math.max(800, 300 + (compareTreks.length * 250))}px` }}>
                    <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md table-fixed">
                        <colgroup>
                            <col style={{ width: '20%' }} />
                            {compareTreks.map(trek => (
                                <col key={`col-${trek.id}`} style={{ width: trekColumnWidth }} />
                            ))}
                        </colgroup>
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b">Feature</th>
                                {compareTreks.map(trek => (
                                    <th key={trek.id} className="py-3 px-4 text-left text-gray-700 font-semibold border-b">
                                        <div className="flex justify-between items-center">
                                            <span className="truncate pr-2">{trek.name}</span>
                                            <button
                                                onClick={() => removeTrekFromComparison(trek.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                                aria-label={`Remove ${trek.name} from comparison`}
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Image Row */}
                            <tr>
                                <td className="py-3 px-4 border-b font-medium text-gray-700">Image</td>
                                {compareTreks.map(trek => (
                                    <td key={trek.id} className="py-3 px-4 border-b">
                                        <div className="h-32 w-full bg-blue-200 flex items-center justify-center rounded-lg">
                                            <span className="text-4xl font-bold text-blue-600">
                                                {trek.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('')}
                                            </span>
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            {/* Location Row */}
                            <tr className="bg-gray-50">
                                <td className="py-3 px-4 border-b font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Location
                                    </div>
                                </td>
                                {compareTreks.map(trek => (
                                    <td key={trek.id} className="py-3 px-4 border-b">{trek.location}</td>
                                ))}
                            </tr>

                            {/* Difficulty Row */}
                            <tr>
                                <td className="py-3 px-4 border-b font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Difficulty
                                    </div>
                                </td>
                                {compareTreks.map(trek => (
                                    <td key={trek.id} className="py-3 px-4 border-b">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColor[trek.difficulty.toLowerCase()]}`}>
                                            {trek.difficulty}
                                        </span>
                                    </td>
                                ))}
                            </tr>

                            {/* Duration Row */}
                            <tr className="bg-gray-50">
                                <td className="py-3 px-4 border-b font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Duration
                                    </div>
                                </td>
                                {compareTreks.map(trek => (
                                    <td key={trek.id} className="py-3 px-4 border-b">{trek.duration}</td>
                                ))}
                            </tr>

                            {/* Elevation Row */}
                            <tr>
                                <td className="py-3 px-4 border-b font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Elevation
                                    </div>
                                </td>
                                {compareTreks.map(trek => (
                                    <td key={trek.id} className="py-3 px-4 border-b">{trek.elevation} ft</td>
                                ))}
                            </tr>

                            {/* Price Row */}
                            <tr className="bg-gray-50">
                                <td className="py-3 px-4 border-b font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <CurrencyRupeeIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Price
                                    </div>
                                </td>
                                {compareTreks.map(trek => (
                                    <td key={trek.id} className="py-3 px-4 border-b font-semibold text-blue-700">
                                        {formatIndianRupees(trek.price)}
                                    </td>
                                ))}
                            </tr>

                            {/* Organizer Row */}
                            <tr>
                                <td className="py-3 px-4 border-b font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Organizer
                                    </div>
                                </td>
                                {compareTreks.map(trek => (
                                    <td key={trek.id} className="py-3 px-4 border-b">{trek.organiser}</td>
                                ))}
                            </tr>

                            {/* Rating Row */}
                            <tr className="bg-gray-50">
                                <td className="py-3 px-4 border-b font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <StarIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Rating
                                    </div>
                                </td>
                                {compareTreks.map(trek => (
                                    <td key={trek.id} className="py-3 px-4 border-b m-auto">
                                        <div className="flex items-center justify-center">
                                            <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                                            <span>{trek.rating}</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            {/* Best Time to Visit Row */}
                            <tr>
                                <td className="py-3 px-4 border-b font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Best Time to Visit
                                    </div>
                                </td>
                                {compareTreks.map(trek => (
                                    <td key={trek.id} className="py-3 px-4 border-b">
                                        {trek.bestTimeToVisit && trek.bestTimeToVisit.length > 0
                                            ? trek.bestTimeToVisit.join(', ')
                                            : 'Not specified'}
                                    </td>
                                ))}
                            </tr>

                            {/* Distance Row */}
                            <tr className="bg-gray-50">
                                <td className="py-3 px-4 border-b font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <MapIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Distance
                                    </div>
                                </td>
                                {compareTreks.map(trek => (
                                    <td key={trek.id} className="py-3 px-4 border-b">{trek.distance} km</td>
                                ))}
                            </tr>

                            {/* Details Link Row */}
                            <tr>
                                <td className="py-3 px-4 border-b font-medium text-gray-700">
                                    <div className="flex items-center">
                                        <InformationCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Details
                                    </div>
                                </td>
                                {compareTreks.map(trek => (
                                    <td key={trek.id} className="py-3 px-4 border-b">
                                        <Link
                                            to={`/trek/${trek.id}`}
                                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompareTreksPage;
