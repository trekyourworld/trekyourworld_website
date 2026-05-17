import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  ClockIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { adminService } from '../../../services/api/admin';

const TABS = [
  { key: 'pending', label: 'Pending', Icon: ClockIcon },
  { key: 'approved', label: 'Approved', Icon: CheckCircleIcon },
  { key: 'rejected', label: 'Rejected', Icon: XCircleIcon },
];

const ManagePhotos = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getPhotos(activeTab);
      setPhotos(res.data?.data ?? []);
    } catch {
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { loadPhotos(); }, [loadPhotos]);

  const review = async (photoId, action) => {
    setActionLoading(photoId + action);
    try {
      await adminService.reviewPhoto(photoId, action);
      setPhotos((prev) => prev.filter((p) => p.photoId !== photoId));
    } catch {
      // ignore
    } finally {
      setActionLoading(null);
    }
  };

  const hardDelete = async (photoId) => {
    if (!window.confirm('Permanently delete this photo?')) return;
    setActionLoading(photoId + 'delete');
    try {
      await adminService.adminDeletePhoto(photoId);
      setPhotos((prev) => prev.filter((p) => p.photoId !== photoId));
    } catch {
      // ignore
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Community Photos</h1>
        <p className="text-gray-500 text-sm mt-1">Review and moderate user-submitted trek photos.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="break-inside-avoid rounded-xl bg-gray-100 animate-pulse h-40" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
          <PhotoIcon className="w-14 h-14 mb-3 opacity-40" />
          <p className="text-sm">No {activeTab} photos.</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
          {photos.map((p) => (
            <div key={p.photoId} className="group break-inside-avoid relative rounded-xl overflow-hidden bg-gray-100">
              <img
                src={p.url}
                alt={p.caption || 'Community photo'}
                className="w-full object-cover"
                loading="lazy"
              />

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1.5">
                {p.caption && (
                  <p className="text-xs text-white line-clamp-2 mb-auto">{p.caption}</p>
                )}
                <p className="text-xs text-white/70">by {p.userName ?? 'Unknown'}</p>

                <div className="flex gap-1.5">
                  {activeTab === 'pending' && (
                    <>
                      <button
                        onClick={() => review(p.photoId, 'approve')}
                        disabled={!!actionLoading}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => review(p.photoId, 'reject')}
                        disabled={!!actionLoading}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        <XCircleIcon className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => hardDelete(p.photoId)}
                    disabled={!!actionLoading}
                    className="flex items-center justify-center p-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors disabled:opacity-50"
                    title="Delete permanently"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePhotos;
