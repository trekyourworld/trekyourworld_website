import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/api/bookingService';

const LIMIT = 10;

const STATUS_BADGE = {
    pending:   { label: 'Pending',   className: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
    completed: { label: 'Completed', className: 'bg-gray-100 text-gray-700' },
};

function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatAmount(amountMinorUnits, currency) {
    if (!amountMinorUnits) return '—';
    const amount = amountMinorUnits / 100;
    try {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency || 'INR', maximumFractionDigits: 0 }).format(amount);
    } catch {
        return `${currency || '₹'}${amount.toLocaleString()}`;
    }
}

const MyBookingsTab = () => {
    const [bookings, setBookings] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchBookings = useCallback(async (p = 1, replace = false) => {
        setLoading(true);
        setError('');
        try {
            const res = await bookingService.getMyBookings({ page: p, limit: LIMIT });
            const payload = res?.data?.data || {};
            const items = payload.data || [];
            setTotal(payload.totalItems || 0);
            setBookings(prev => replace ? items : [...prev, ...items]);
        } catch (e) {
            console.error(e);
            setError('Failed to load your bookings.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings(1, true);
    }, [fetchBookings]);

    const handleLoadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchBookings(next);
    };

    const hasMore = bookings.length < total;

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">My Bookings</h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {bookings.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-3">No bookings yet. Start exploring!</p>
                    <Link to="/explore" className="text-blue-600 hover:underline font-medium">
                        Browse treks →
                    </Link>
                </div>
            )}

            <div className="space-y-4">
                {bookings.map((booking) => {
                    const badge = STATUS_BADGE[booking.status] || { label: booking.status, className: 'bg-gray-100 text-gray-700' };
                    return (
                        <div key={booking.bookingId} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex gap-4 p-4 shadow-sm">
                            {/* Trek image */}
                            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                                {booking.trekImage ? (
                                    <img
                                        src={booking.trekImage}
                                        alt={booking.trekTitle}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                    <div>
                                        <p className="font-semibold text-gray-900 truncate">{booking.trekTitle || 'Unknown Trek'}</p>
                                        {booking.communityName && (
                                            <p className="text-sm text-gray-500">{booking.communityName}</p>
                                        )}
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${badge.className}`}>
                                        {badge.label}
                                    </span>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                    <span>
                                        <span className="text-gray-400">Date: </span>
                                        {formatDate(booking.trekDate)}
                                    </span>
                                    <span>
                                        <span className="text-gray-400">Participants: </span>
                                        {booking.participants}
                                    </span>
                                    <span>
                                        <span className="text-gray-400">Amount: </span>
                                        {formatAmount(booking.amountMinorUnits, booking.currency)}
                                    </span>
                                </div>

                                {booking.trekUid && (
                                    <div className="mt-2">
                                        <Link
                                            to={`/explore/${booking.trekUid}`}
                                            className="text-sm text-blue-600 hover:underline font-medium"
                                        >
                                            View Trek →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {loading && (
                <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
                </div>
            )}

            {hasMore && !loading && (
                <div className="mt-6 text-center">
                    <button
                        onClick={handleLoadMore}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Load more
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyBookingsTab;
