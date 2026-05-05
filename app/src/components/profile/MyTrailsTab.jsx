import { useState, useEffect, useCallback } from 'react';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import { guideService } from '../../services/api/guideService';
import TrailSubmissionModal from '../guide/TrailSubmissionModal';

const STATUS_BADGE = {
  pending:  { label: 'Under Review', cls: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Published',    cls: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected',     cls: 'bg-red-100 text-red-700' },
};

export default function MyTrailsTab() {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editTrail, setEditTrail] = useState(null);

  const fetchTrails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await guideService.getTrails();
      setTrails(res?.data?.data?.data || []);
    } catch {
      setError('Failed to load your trails.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrails(); }, [fetchTrails]);

  const handleEdit = (trail) => {
    setEditTrail(trail);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditTrail(null);
    setShowModal(true);
  };

  const handleSubmitted = () => {
    fetchTrails();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">My Trail Submissions</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Submit New Trail
        </button>
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading trails…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && trails.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">You haven't submitted any trails yet.</p>
          <button
            onClick={handleAdd}
            className="text-blue-600 hover:underline text-sm"
          >Submit your first trail →</button>
        </div>
      )}

      {trails.length > 0 && (
        <div className="space-y-4">
          {trails.map((trail) => {
            const badge = STATUS_BADGE[trail.reviewStatus] || STATUS_BADGE.pending;
            return (
              <div key={trail.uuid} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900">{trail.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{trail.location}</p>
                    {trail.reviewStatus === 'rejected' && trail.reviewNotes && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                        <span className="font-medium">Review note:</span> {trail.reviewNotes}
                      </p>
                    )}
                  </div>
                  {trail.reviewStatus !== 'approved' && (
                    <button
                      onClick={() => handleEdit(trail)}
                      className="ml-4 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 shrink-0"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <TrailSubmissionModal
          editTrail={editTrail}
          onClose={() => { setShowModal(false); setEditTrail(null); }}
          onSubmitted={handleSubmitted}
        />
      )}
    </div>
  );
}
