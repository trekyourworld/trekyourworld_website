import { useState, useRef } from 'react';
import { XMarkIcon, PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { photoService } from '../../services/api/photoService';

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const PhotoUploadModal = ({ mountainId, onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    setError(null);
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed.');
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_SIZE_MB} MB.`);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const res = await photoService.uploadPhoto(mountainId, caption, file);
      onUploaded?.(res.data?.data);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.error;
      if (err?.response?.status === 503) {
        setError('Photo uploads are currently disabled.');
      } else if (err?.response?.status === 429) {
        setError(msg || 'You have reached the photo limit for this trek.');
      } else {
        setError(msg || 'Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Upload a Photo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Drop zone */}
          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Drag & drop or <span className="text-blue-600 font-medium">browse</span></p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG or WebP · max {MAX_SIZE_MB} MB</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
              />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden">
              <img src={preview} alt="Preview" className="w-full h-52 object-cover" />
              <button
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
              >
                <XMarkIcon className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caption <span className="text-gray-400 font-normal">(optional, max 200 chars)</span>
            </label>
            <input
              type="text"
              maxLength={200}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe your photo…"
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <p className="text-xs text-gray-400">
            Photos are reviewed by admins before appearing publicly. Max 10 photos per trek.
          </p>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || uploading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadModal;
