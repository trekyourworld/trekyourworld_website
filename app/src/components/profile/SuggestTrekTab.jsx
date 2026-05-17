import { useState, useEffect, useCallback } from 'react';
import { suggestionService } from '../../services/api/suggestionService';

const ACTIVITY_TYPES = [
  { value: '', label: 'Select activity type (optional)' },
  { value: 'trek', label: 'Trek' },
  { value: 'day_hike', label: 'Day Hike' },
  { value: 'trail_walk', label: 'Trail Walk' },
  { value: 'nature_walk', label: 'Nature Walk' },
  { value: 'expedition', label: 'Expedition' },
];

const DIFFICULTY_OPTIONS = ['easy', 'moderate', 'difficult', 'challenging', 'extreme'];

const STATUS_BADGE = {
  pending:      'bg-gray-100 text-gray-700',
  under_review: 'bg-yellow-100 text-yellow-800',
  accepted:     'bg-green-100 text-green-800',
  rejected:     'bg-red-100 text-red-800',
  duplicate:    'bg-orange-100 text-orange-800',
};

const STATUS_LABEL = {
  pending:      'Pending Review',
  under_review: 'Under Review',
  accepted:     'Accepted — Added to Directory',
  rejected:     'Rejected',
  duplicate:    'Duplicate',
};

const INITIAL_FORM = {
  name: '',
  location: '',
  activityType: '',
  description: '',
  difficulty: [],
  duration: '',
  additionalInfo: '',
};

const LIMIT = 10;

export default function SuggestTrekTab() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  // Expanded row for admin notes
  const [expanded, setExpanded] = useState({});

  const fetchHistory = useCallback(async (p = 1, replace = false) => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const res = await suggestionService.getMySuggestions({ page: p, limit: LIMIT });
      const paginated = res?.data?.data || {};
      const items = paginated.data || [];
      setTotal(paginated.totalItems || 0);
      setSuggestions(prev => replace ? items : [...prev, ...items]);
    } catch (e) {
      console.error(e);
      setHistoryError('Failed to load your suggestions.');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    setSuggestions([]);
    setPage(1);
    fetchHistory(1, true);
  }, [fetchHistory]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const toggleDifficulty = (level) => {
    setForm(f => ({
      ...f,
      difficulty: f.difficulty.includes(level)
        ? f.difficulty.filter(d => d !== level)
        : [...f.difficulty, level],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        location: form.location,
        description: form.description,
        activityType: form.activityType || undefined,
        difficulty: form.difficulty.length ? form.difficulty : undefined,
        duration: form.duration ? parseInt(form.duration, 10) : undefined,
        additionalInfo: form.additionalInfo || undefined,
      };
      await suggestionService.submitSuggestion(payload);
      setSubmitSuccess(true);
      setForm(INITIAL_FORM);
      // Refresh history
      setSuggestions([]);
      setPage(1);
      fetchHistory(1, true);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to submit suggestion.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchHistory(next);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Suggest a New Trek</h2>

      {/* Submission form */}
      {submitSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8">
          <p className="text-green-700 font-medium">
            Thank you! We&apos;ll review your suggestion and get back to you.
          </p>
          <button
            className="mt-3 text-sm text-green-700 underline"
            onClick={() => setSubmitSuccess(false)}
          >
            Suggest another trek
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 mb-10">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trek / Trail Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFieldChange}
              required
              minLength={3}
              maxLength={200}
              placeholder="e.g. Valley of Flowers Trek"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleFieldChange}
              required
              placeholder="e.g. Uttarakhand, India"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
            <select
              name="activityType"
              value={form.activityType}
              onChange={handleFieldChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              {ACTIVITY_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFieldChange}
              required
              minLength={20}
              rows={4}
              placeholder="Describe the trek — route, highlights, scenery… (min 20 characters)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => toggleDifficulty(level)}
                  className={`px-3 py-1 rounded-full text-sm border capitalize transition-colors ${
                    form.difficulty.includes(level)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleFieldChange}
              min={1}
              placeholder="e.g. 5"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Info</label>
            <textarea
              name="additionalInfo"
              value={form.additionalInfo}
              onChange={handleFieldChange}
              maxLength={2000}
              rows={3}
              placeholder="Best season, permits required, nearest base camp, etc."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {submitError && (
            <p className="text-red-500 text-sm">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit Suggestion'}
          </button>
        </form>
      )}

      {/* Suggestion history */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Past Suggestions</h3>

        {historyError && <p className="text-red-500 text-sm mb-3">{historyError}</p>}

        {suggestions.length === 0 && !historyLoading && (
          <p className="text-gray-500 text-sm">No suggestions yet.</p>
        )}

        <div className="space-y-3">
          {suggestions.map((s) => (
            <div key={s.suggestionId} className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{s.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.location}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[s.status] || 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABEL[s.status] || s.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Expandable admin notes for rejected / duplicate */}
              {(s.status === 'rejected' || s.status === 'duplicate') && s.adminNotes && (
                <div className="mt-2">
                  <button
                    className="text-xs text-gray-500 underline"
                    onClick={() => setExpanded(prev => ({ ...prev, [s.suggestionId]: !prev[s.suggestionId] }))}
                  >
                    {expanded[s.suggestionId] ? 'Hide notes' : 'View admin notes'}
                  </button>
                  {expanded[s.suggestionId] && (
                    <p className="mt-1 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg p-2">
                      {s.adminNotes}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {suggestions.length < total && (
          <button
            onClick={handleLoadMore}
            disabled={historyLoading}
            className="mt-4 text-sm text-blue-600 hover:underline disabled:opacity-50"
          >
            {historyLoading ? 'Loading…' : 'Load more'}
          </button>
        )}
      </div>
    </div>
  );
}
