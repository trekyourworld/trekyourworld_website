import { useState, useEffect, useCallback } from 'react';
import { StarIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { reviewService } from '../../services/api/reviewService';

const LIMIT = 10;

const GuideReviewsTab = () => {
    const [reviews, setReviews] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Reply state: { [reviewId]: { open, text, submitting, error, success } }
    const [replyState, setReplyState] = useState({});

    const fetchReviews = useCallback(async (p = 1, replace = false) => {
        setLoading(true);
        setError('');
        try {
            const res = await reviewService.getGuideReviews({ page: p, limit: LIMIT });
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
        fetchReviews(1, true);
    }, [fetchReviews]);

    const handleLoadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchReviews(next);
    };

    const toggleReply = (reviewId, existingReply = '') => {
        setReplyState(prev => ({
            ...prev,
            [reviewId]: prev[reviewId]?.open
                ? { open: false, text: '', submitting: false, error: '', success: false }
                : { open: true, text: existingReply, submitting: false, error: '', success: false },
        }));
    };

    const handleReplyChange = (reviewId, text) => {
        setReplyState(prev => ({ ...prev, [reviewId]: { ...prev[reviewId], text } }));
    };

    const handleReplySubmit = async (reviewId) => {
        const state = replyState[reviewId];
        if (!state?.text?.trim()) return;
        setReplyState(prev => ({ ...prev, [reviewId]: { ...prev[reviewId], submitting: true, error: '' } }));
        try {
            await reviewService.replyToReview(reviewId, state.text.trim());
            setReplyState(prev => ({ ...prev, [reviewId]: { ...prev[reviewId], submitting: false, success: true } }));
            // Refresh reviews to show updated reply
            fetchReviews(1, true);
            setPage(1);
        } catch (err) {
            const msg = err?.response?.data?.error || 'Failed to submit reply.';
            setReplyState(prev => ({ ...prev, [reviewId]: { ...prev[reviewId], submitting: false, error: msg } }));
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reviews on Your Trails</h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {reviews.length === 0 && !loading && (
                <p className="text-gray-500 text-sm">No reviews yet for your trails.</p>
            )}

            <div className="space-y-4">
                {reviews.map((rev) => {
                    const rs = replyState[rev.reviewId] || {};
                    return (
                        <div key={rev.reviewId} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-800 text-sm">{rev.userName || 'User'}</span>
                                <span className="flex items-center gap-0.5">
                                    {[1,2,3,4,5].map(s => (
                                        <StarIcon key={s} className={`h-3.5 w-3.5 ${s <= rev.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                </span>
                                <span className="text-xs text-gray-400 ml-auto">
                                    {new Date(rev.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-1">Trek ID: {rev.mountainId}</p>
                            <p className="text-gray-700 text-sm mb-3">{rev.body}</p>

                            {/* Existing guide reply */}
                            {rev.guideReply && !rs.open && (
                                <div className="ml-4 pl-3 border-l-2 border-green-200 mb-2">
                                    <p className="text-xs text-green-700 font-medium mb-0.5">Your Reply</p>
                                    <p className="text-sm text-gray-600">{rev.guideReply.body}</p>
                                </div>
                            )}

                            {/* Reply toggle */}
                            <button
                                onClick={() => toggleReply(rev.reviewId, rev.guideReply?.body || '')}
                                className="flex items-center gap-1 text-sm text-green-700 hover:text-green-900 font-medium"
                            >
                                {rs.open ? 'Cancel' : rev.guideReply ? 'Edit Reply' : 'Reply'}
                                {!rs.open && <ChevronDownIcon className="h-4 w-4" />}
                            </button>

                            {rs.open && (
                                <div className="mt-3 space-y-2">
                                    <textarea
                                        rows={3}
                                        value={rs.text}
                                        onChange={e => handleReplyChange(rev.reviewId, e.target.value)}
                                        placeholder="Write your reply…"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                    {rs.error && <p className="text-red-500 text-xs">{rs.error}</p>}
                                    {rs.success && <p className="text-green-600 text-xs">Reply submitted!</p>}
                                    <button
                                        onClick={() => handleReplySubmit(rev.reviewId)}
                                        disabled={rs.submitting}
                                        className="bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        {rs.submitting ? 'Submitting…' : 'Submit Reply'}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
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
                <p className="text-gray-500 text-sm">Loading reviews…</p>
            )}
        </div>
    );
};

export default GuideReviewsTab;
