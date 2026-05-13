import { useState, useEffect, useCallback } from 'react';
import { StarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { reviewService } from '../../../services/api/reviewService';

const LIMIT = 15;
const TABS = ['pending', 'published', 'rejected'];

const STATUS_BADGE = {
    pending: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

export default function ManageReviews() {
    const [activeTab, setActiveTab] = useState('pending');
    const [reviews, setReviews] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [moderating, setModerating] = useState({}); // { [reviewId]: true }

    const fetchReviews = useCallback(async (status, p = 1, replace = false) => {
        setLoading(true);
        setError('');
        try {
            const res = await reviewService.getAdminReviews({ status, page: p, limit: LIMIT });
            const paginated = res?.data?.data || {};
            const items = paginated.data || [];
            setTotal(paginated.totalItems || 0);
            setReviews(prev => replace ? items : [...prev, ...items]);
        } catch (e) {
            console.error(e);
            setError('Failed to load reviews.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setReviews([]);
        setPage(1);
        fetchReviews(activeTab, 1, true);
    }, [activeTab, fetchReviews]);

    const handleLoadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchReviews(activeTab, next);
    };

    const handleModerate = async (reviewId, action) => {
        setModerating(prev => ({ ...prev, [reviewId]: true }));
        try {
            await reviewService.moderateReview(reviewId, action);
            // Remove from current list
            setReviews(prev => prev.filter(r => r.reviewId !== reviewId));
            setTotal(t => t - 1);
        } catch (e) {
            console.error(e);
            setError('Failed to moderate review. Please try again.');
        } finally {
            setModerating(prev => ({ ...prev, [reviewId]: false }));
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Reviews</h1>

            {/* Tab bar */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                            activeTab === tab
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {reviews.length === 0 && !loading && (
                <p className="text-gray-500 text-sm">No {activeTab} reviews.</p>
            )}

            <div className="space-y-4">
                {reviews.map((rev) => (
                    <div key={rev.reviewId} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-medium text-gray-800 text-sm">{rev.userName || rev.userId}</span>
                                    <span className="flex items-center gap-0.5">
                                        {[1,2,3,4,5].map(s => (
                                            <StarIcon key={s} className={`h-3.5 w-3.5 ${s <= rev.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                        ))}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[rev.status]}`}>
                                        {rev.status}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-auto">
                                        {new Date(rev.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mb-1">Trek: {rev.mountainId}</p>
                                <p className="text-gray-700 text-sm line-clamp-3">{rev.body}</p>
                            </div>

                            {/* Action buttons — only on pending */}
                            {rev.status === 'pending' && (
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => handleModerate(rev.reviewId, 'approve')}
                                        disabled={moderating[rev.reviewId]}
                                        title="Approve"
                                        className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        <CheckCircleIcon className="h-4 w-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleModerate(rev.reviewId, 'reject')}
                                        disabled={moderating[rev.reviewId]}
                                        title="Reject"
                                        className="flex items-center gap-1 bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                    >
                                        <XCircleIcon className="h-4 w-4" />
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {reviews.length < total && (
                <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="mt-6 text-sm text-blue-600 hover:underline disabled:opacity-50"
                >
                    {loading ? 'Loading…' : `Load more (${total - reviews.length} remaining)`}
                </button>
            )}
            {loading && reviews.length === 0 && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
                </div>
            )}
        </div>
    );
}
