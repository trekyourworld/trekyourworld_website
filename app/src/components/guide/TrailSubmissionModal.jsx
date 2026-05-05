import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ACTIVITY_TYPE_LABELS } from '../../constants/activityTypes';
import { guideService } from '../../services/api/guideService';

const EMPTY_FORM = {
  title: '',
  description: '',
  location: '',
  elevation: '',
  duration: '',
  distance: '',
  difficulty: [],
  tags: '',
  activityType: 'trek',
  bestTimeToTarget: [],
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const DIFFICULTIES = ['Easy', 'Moderate', 'Difficult', 'Expert'];

export default function TrailSubmissionModal({ onClose, onSubmitted, editTrail = null }) {
  const [form, setForm] = useState(() => editTrail
    ? {
        ...EMPTY_FORM,
        title: editTrail.title || '',
        description: editTrail.description || '',
        location: editTrail.location || '',
        elevation: editTrail.elevation || '',
        duration: editTrail.duration || '',
        distance: editTrail.distance || '',
        difficulty: editTrail.difficulty || [],
        tags: (editTrail.tags || []).join(', '),
        activityType: editTrail.activityType || 'trek',
        bestTimeToTarget: editTrail.bestTimeToTarget || [],
      }
    : { ...EMPTY_FORM });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMulti = (field, value) => {
    setForm((prev) => {
      const list = prev[field] || [];
      return {
        ...prev,
        [field]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...form,
        elevation: form.elevation ? parseInt(form.elevation, 10) : 0,
        duration: form.duration ? parseInt(form.duration, 10) : 0,
        distance: form.distance ? parseInt(form.distance, 10) : 0,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (editTrail?.uuid) {
        await guideService.updateTrail(editTrail.uuid, payload);
      } else {
        await guideService.submitTrail(payload);
      }
      onSubmitted?.();
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to submit trail');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center pt-10 pb-10 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {editTrail ? 'Edit Trail' : 'Submit New Trail'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trail Title *</label>
            <input
              name="title" value={form.title} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Roopkund Trek"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description" value={form.description} onChange={handleChange} rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the trail..."
            />
          </div>

          {/* Location + Activity Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                name="location" value={form.location} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Uttarakhand, India"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
              <select
                name="activityType" value={form.activityType} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(ACTIVITY_TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Elevation / Duration / Distance */}
          <div className="grid grid-cols-3 gap-4">
            {[['elevation', 'Elevation (m)'], ['duration', 'Duration (days)'], ['distance', 'Distance (km)']].map(([n, l]) => (
              <div key={n}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                <input
                  type="number" name={n} value={form[n]} onChange={handleChange} min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <div className="flex gap-3 flex-wrap">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d} type="button"
                  onClick={() => toggleMulti('difficulty', d)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    form.difficulty.includes(d)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >{d}</button>
              ))}
            </div>
          </div>

          {/* Best Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Best Time to Visit</label>
            <div className="flex gap-2 flex-wrap">
              {MONTHS.map((m) => (
                <button
                  key={m} type="button"
                  onClick={() => toggleMulti('bestTimeToTarget', m)}
                  className={`px-2 py-1 rounded-full text-xs border transition-colors ${
                    form.bestTimeToTarget.includes(m)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                  }`}
                >{m.slice(0, 3)}</button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              name="tags" value={form.tags} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. snow, alpine, remote"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >Cancel</button>
            <button
              type="submit" disabled={submitting}
              className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >{submitting ? 'Submitting…' : editTrail ? 'Save Changes' : 'Submit Trail'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
