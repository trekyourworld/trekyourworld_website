import { useState, useEffect, useCallback } from 'react';
import { CameraIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { photoService } from '../../services/api/photoService';
import PhotoUploadModal from './PhotoUploadModal';

const CommunityPhotosSection = ({ mountainId, communityPhotosEnabled }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await photoService.getTrekPhotos(mountainId, 1, 20);
      setPhotos(res.data?.data ?? []);
    } catch {
      // fail silently — photos are supplemental
    } finally {
      setLoading(false);
    }
  }, [mountainId]);

  useEffect(() => {
    if (mountainId) loadPhotos();
  }, [mountainId, loadPhotos]);

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <CameraIcon className="w-6 h-6 text-blue-500" />
          Community Photos
        </h2>
        {communityPhotosEnabled && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            Add a Photo
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
          <CameraIcon className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-sm">No community photos yet.</p>
          {communityPhotosEnabled && (
            <p className="text-sm mt-1">
              Be the first to{' '}
              <button onClick={() => setShowModal(true)} className="text-blue-500 hover:underline">
                upload a photo
              </button>
              !
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((p) => (
            <div key={p.photoId} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img
                src={p.url}
                alt={p.caption || 'Community photo'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {p.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white line-clamp-2">{p.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <PhotoUploadModal
          mountainId={mountainId}
          onClose={() => setShowModal(false)}
          onUploaded={() => {}}
        />
      )}
    </section>
  );
};

export default CommunityPhotosSection;
