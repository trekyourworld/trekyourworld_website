import { useState, useEffect, useCallback } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { reviewService } from '../../services/api/reviewService';

const LIMIT = 10;

const STATUS_BADGE = {
    pending: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

const MyReviewsTab = () => {
    const [reviews, setReviews] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchReviews = useCallback(async (p = 1, replace = false) => {
        setLoading(true);
        setError('');
        try {
            const res = await reviewService.getMyReviews({ page: p, limit: LIMIT });
            const paginated = res?.data?.data || {};
            const items = paginated.data || [];
            setTotal(paginated.totalItems || 0);
            setReviews(prev => replace ? items : [...prev, ...items]);
        } catch (e) {
            console.error(e);
            setError('Failed to load your reviews.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews(1, true);
    }, [fetchReviews]);

    const handleLoadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchReviews(next);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">My Reviews</h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {reviews.length === 0 && !loading && (
                <p className="text-gray-500 text-sm">You have not submitted any reviews yet. Visit a trek page to write one!</p>
            )}

            <div className="space-y-4">
                {reviews.map((rev) => (
                    <div key={rev.reviewId} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="flex items-center gap-0.5">
                                {[1,2,3,4,5].map(s => (
                                    <StarIcon key={s} className={`h-4 w-4 ${s <= rev.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </span>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[rev.status] || 'bg-gray-100 text-gray-700'}`}>
                                {rev.status.charAt(0).toUpperCase() + rev.status.slice(1)}
                            </span>
                            <span className="text-xs text-gray-400 ml-auto">
                                {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">Trek: {rev.mountainId}</p>
                        <p className="text-gray-700 text-sm">{rev.body}</p>
                        {rev.guideReply && (
                            <div className="mt-3 ml-4 pl-3 border-l-2 border-green-200">
                                <p className="text-xs text-green-700 font-medium mb-0.5">Guide Reply — {rev.guideReply.guideName}</p>
                                <p className="text-sm text-gray-600">{rev.guideReply.body}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {reviews.length < total && (
                <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="mt-4 text-sm text-blue-600 hover:underline disabled:opacity-50"
                >
                    {loading ? 'Loading…' : 'Load more'}
                </button>
            )}
            {loading && reviews.length === 0 && (
                <p className="text-gray-500 text-sm">Loading…</p>
            )}
        </div>
    );
};

export default MyReviewsTab;
