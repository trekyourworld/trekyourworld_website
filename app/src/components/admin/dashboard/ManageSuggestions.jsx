import { useState, useEffect, useCallback } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, DocumentDuplicateIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { suggestionService } from '../../../services/api/suggestionService';

const LIMIT = 15;
const TABS = [
  { key: 'pending',      label: 'Pending' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'accepted',     label: 'Accepted' },
  { key: 'rejected',     label: 'Rejected / Duplicate' },
];

const STATUS_BADGE = {
  pending:      'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  accepted:     'bg-green-100 text-green-800',
  rejected:     'bg-red-100 text-red-800',
  duplicate:    'bg-orange-100 text-orange-800',
};

export default function ManageSuggestions() {
  const [activeTab, setActiveTab] = useState('pending');
  const [suggestions, setSuggestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Side panel state
  const [selected, setSelected] = useState(null);   // full suggestion in panel
  const [panelLoading, setPanelLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  const fetchSuggestions = useCallback(async (tab, p = 1, replace = false) => {
    setLoading(true);
    setError('');
    try {
      // For the rejected tab we fetch both rejected and duplicate by passing no status
      // but filter client-side. Alternatively fetch twice. Here we use status='' and filter.
      const statusParam = tab === 'rejected' ? '' : tab;
      const res = await suggestionService.getAdminSuggestions({ status: statusParam, page: p, limit: LIMIT });
      const paginated = res?.data?.data || {};
      let items = paginated.data || [];
      if (tab === 'rejected') {
        items = items.filter(s => s.status === 'rejected' || s.status === 'duplicate');
      }
      setTotal(paginated.totalItems || 0);
      setSuggestions(prev => replace ? items : [...prev, ...items]);
    } catch (e) {
      console.error(e);
      setError('Failed to load suggestions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSuggestions([]);
    setPage(1);
    setSelected(null);
    fetchSuggestions(activeTab, 1, true);
  }, [activeTab, fetchSuggestions]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchSuggestions(activeTab, next);
  };

  const openPanel = async (suggestion) => {
    setSelected(suggestion);
    setAdminNotes('');
    setReviewSuccess('');
    setReviewError('');
    // Optionally fetch full detail
    setPanelLoading(true);
    try {
      const res = await suggestionService.getSuggestionDetail(suggestion.suggestionId);
      setSelected(res?.data?.data || suggestion);
    } catch {
      // fall back to list item
    } finally {
      setPanelLoading(false);
    }
  };

  const closePanel = () => {
    setSelected(null);
    setReviewSuccess('');
    setReviewError('');
  };

  const handleReview = async (action) => {
    if (!selected) return;
    setReviewing(true);
    setReviewError('');
    setReviewSuccess('');
    try {
      const res = await suggestionService.reviewSuggestion(selected.suggestionId, action, adminNotes);
      const updated = res?.data?.data;
      setReviewSuccess(
        action === 'accept'
          ? `Accepted! Draft trek UUID: ${updated?.newTrekUuid || '—'}`
          : `Suggestion marked as ${updated?.status || action}.`
      );
      // Remove from list
      setSuggestions(prev => prev.filter(s => s.suggestionId !== selected.suggestionId));
      setTotal(t => Math.max(0, t - 1));
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || 'Failed to review suggestion.';
      setReviewError(msg);
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div className="p-6 flex gap-6">
      {/* Left: list */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Trek Suggestions</h1>

        {/* Tab bar */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {suggestions.length === 0 && !loading && (
          <p className="text-gray-500 text-sm">No suggestions in this category.</p>
        )}

        <div className="space-y-3">
          {suggestions.map((s) => (
            <div
              key={s.suggestionId}
              className={`bg-white rounded-xl border shadow-sm p-4 cursor-pointer transition-colors hover:border-blue-300 ${
                selected?.suggestionId === s.suggestionId ? 'border-blue-400 ring-1 ring-blue-300' : 'border-gray-200'
              }`}
              onClick={() => openPanel(s)}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{s.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.location}</p>
                  {s.activityType && (
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{s.activityType.replace('_', ' ')}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[s.status] || 'bg-gray-100 text-gray-600'}`}>
                    {s.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {suggestions.length < total && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="mt-6 text-sm text-blue-600 hover:underline disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Load more'}
          </button>
        )}
      </div>

      {/* Right: side panel */}
      {selected && (
        <div className="w-96 shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm p-5 self-start sticky top-4">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Suggestion Detail</h2>
            <button onClick={closePanel} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {panelLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 text-xs">Name</span>
                <p className="font-medium text-gray-800">{selected.name}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Location</span>
                <p className="text-gray-700">{selected.location}</p>
              </div>
              {selected.activityType && (
                <div>
                  <span className="text-gray-500 text-xs">Activity Type</span>
                  <p className="text-gray-700 capitalize">{selected.activityType.replace('_', ' ')}</p>
                </div>
              )}
              {selected.difficulty?.length > 0 && (
                <div>
                  <span className="text-gray-500 text-xs">Difficulty</span>
                  <p className="text-gray-700 capitalize">{selected.difficulty.join(', ')}</p>
                </div>
              )}
              {selected.duration > 0 && (
                <div>
                  <span className="text-gray-500 text-xs">Duration</span>
                  <p className="text-gray-700">{selected.duration} day{selected.duration !== 1 ? 's' : ''}</p>
                </div>
              )}
              <div>
                <span className="text-gray-500 text-xs">Description</span>
                <p className="text-gray-700 whitespace-pre-wrap">{selected.description}</p>
              </div>
              {selected.additionalInfo && (
                <div>
                  <span className="text-gray-500 text-xs">Additional Info</span>
                  <p className="text-gray-700 whitespace-pre-wrap">{selected.additionalInfo}</p>
                </div>
              )}
              <div>
                <span className="text-gray-500 text-xs">Submitted by</span>
                <p className="text-gray-700 font-mono text-xs">{selected.userId}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Status</span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[selected.status] || ''}`}>
                  {selected.status.replace('_', ' ')}
                </span>
              </div>

              {/* Admin Notes textarea */}
              {!reviewSuccess && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Admin Notes (optional)</label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                    placeholder="Notes for the user…"
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              )}

              {reviewSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-xs font-medium">{reviewSuccess}</p>
                  {selected.newTrekUuid && (
                    <a
                      href={`/admin/treks?edit=${selected.newTrekUuid}`}
                      className="inline-block mt-1 text-xs text-blue-600 hover:underline"
                    >
                      Open in Trek Editor →
                    </a>
                  )}
                </div>
              )}

              {reviewError && <p className="text-red-500 text-xs">{reviewError}</p>}

              {/* Action buttons */}
              {!reviewSuccess && selected.status !== 'accepted' && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleReview('accept')}
                    disabled={reviewing}
                    className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    Accept &amp; Create Draft
                  </button>
                  <button
                    onClick={() => handleReview('mark_review')}
                    disabled={reviewing}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                  >
                    <ClockIcon className="h-4 w-4" />
                    Mark Under Review
                  </button>
                  <button
                    onClick={() => handleReview('reject')}
                    disabled={reviewing}
                    className="flex items-center gap-1 bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <XCircleIcon className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleReview('duplicate')}
                    disabled={reviewing}
                    className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs px-3 py-1.5 rounded-lg hover:bg-orange-200 transition-colors disabled:opacity-50"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                    Mark Duplicate
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
