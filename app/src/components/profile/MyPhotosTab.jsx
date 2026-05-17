import { useState, useEffect, useCallback } from 'react';
import { CameraIcon, ArrowUpTrayIcon, TrashIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { photoService } from '../../services/api/photoService';
import PhotoUploadModal from '../explore/PhotoUploadModal';

const STATUS_BADGE = {
  pending: { label: 'Under Review', Icon: ClockIcon, cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  approved: { label: 'Approved', Icon: CheckCircleIcon, cls: 'bg-green-50 text-green-700 border-green-200' },
  rejected: { label: 'Rejected', Icon: XCircleIcon, cls: 'bg-red-50 text-red-700 border-red-200' },
};

const MyPhotosTab = ({ communityPhotosEnabled }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await photoService.getMyPhotos(1, 50);
      setPhotos(res.data?.data ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPhotos(); }, [loadPhotos]);

  const handleDelete = async (photoId) => {
    if (!window.confirm('Delete this photo?')) return;
    setDeleting(photoId);
    try {
      await photoService.deleteMyPhoto(photoId);
      setPhotos((prev) => prev.filter((p) => p.photoId !== photoId));
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">My Photos</h2>
        {communityPhotosEnabled && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            Upload a Photo
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
          <CameraIcon className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-sm">You haven't uploaded any photos yet.</p>
          {communityPhotosEnabled && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 text-sm text-blue-500 hover:underline"
            >
              Upload your first photo
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((p) => {
            const badge = STATUS_BADGE[p.status] ?? STATUS_BADGE.pending;
            return (
              <div key={p.photoId} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={p.url}
                  alt={p.caption || 'My photo'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Status badge */}
                <div className={`absolute top-2 left-2 flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${badge.cls}`}>
                  <badge.Icon className="w-3 h-3" />
                  {badge.label}
                </div>
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(p.photoId)}
                  disabled={deleting === p.photoId}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                {/* Caption */}
                {p.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white line-clamp-2">{p.caption}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <PhotoUploadModal
          mountainId={null}
          onClose={() => setShowModal(false)}
          onUploaded={() => { loadPhotos(); }}
        />
      )}
    </div>
  );
};

export default MyPhotosTab;
