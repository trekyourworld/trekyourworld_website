import { useState, useEffect, useCallback } from 'react';
import { CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import { guideService } from '../../../services/api/guideService';

export default function PendingTrails() {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  const fetchTrails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await guideService.getPendingTrails();
      setTrails(res?.data?.data?.data || []);
    } catch {
      setError('Failed to load pending trails.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrails(); }, [fetchTrails]);

  const handleReview = async (action) => {
    if (!selected) return;
    if (action === 'reject' && !reviewNotes.trim()) {
      setReviewError('Please provide a reason for rejection.');
      return;
    }
    setReviewing(true);
    setReviewError(null);
    try {
      await guideService.reviewTrail(selected.uuid, { action, notes: reviewNotes });
      setSelected(null);
      setReviewNotes('');
      fetchTrails();
    } catch {
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Trail Submissions</h1>

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && trails.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No pending trail submissions</p>
          <p className="text-sm mt-1">All trails have been reviewed.</p>
        </div>
      )}

      {trails.length > 0 && (
        <div className="flex gap-6">
          {/* Trail list */}
          <div className="flex-1 min-w-0 space-y-3">
            {trails.map((trail) => (
              <div
                key={trail.uuid}
                onClick={() => { setSelected(trail); setReviewNotes(''); setReviewError(null); }}
                className={`border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all ${
                  selected?.uuid === trail.uuid ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{trail.title}</h3>
                    <p className="text-sm text-gray-500">{trail.location}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted by guide: {trail.submittedByGuideId || '—'}
                    </p>
                  </div>
                  <EyeIcon className={`w-5 h-5 shrink-0 ml-2 ${selected?.uuid === trail.uuid ? 'text-blue-500' : 'text-gray-300'}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Review panel */}
          {selected && (
            <div className="w-96 shrink-0 border border-gray-200 rounded-xl bg-white p-6 h-fit sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">{selected.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{selected.location}</p>

              <div className="space-y-2 text-sm text-gray-700 mb-5">
                {[
                  ['Duration', `${selected.duration} days`],
                  ['Elevation', `${selected.elevation} m`],
                  ['Distance', `${selected.distance} km`],
                  ['Activity', selected.activityType],
                  ['Difficulty', (selected.difficulty || []).join(', ')],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between">
                    <span className="text-gray-500">{l}</span>
                    <span className="font-medium">{v || '—'}</span>
                  </div>
                ))}
              </div>

              {selected.description && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-5 line-clamp-4">
                  {selected.description}
                </p>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Notes (required for rejection)
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional for approval, required for rejection…"
                />
              </div>

              {reviewError && (
                <p className="text-sm text-red-600 mb-3">{reviewError}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handleReview('approve')}
                  disabled={reviewing}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium"
                >
                  <CheckIcon className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleReview('reject')}
                  disabled={reviewing}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
