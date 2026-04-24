import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, XMarkIcon, PlusIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { adminService } from '../../../services/api/admin';

const POSITIONS = ['hero', 'sidebar', 'popup'];
const STATUSES  = ['active', 'inactive'];

const emptyForm = { id: null, title: '', imageUrl: '', link: '', description: '', position: 'hero', status: 'active', displayOrder: 0 };

const ManageBanners = () => {
  const [banners, setBanners]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving]   = useState(false);

  // ── fetch ─────────────────────────────────────────────────────────────────
  const fetchBanners = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await adminService.getBanners();
      setBanners(data?.data ?? []);
    } catch {
      setError('Failed to load banners.');
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  // ── form helpers ──────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'displayOrder' ? Number(value) : value }));
  };

  const handleAddClick = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditClick = (banner) => {
    setForm({
      id:           banner.bannerId,
      title:        banner.title,
      imageUrl:     banner.imageUrl,
      link:         banner.link,
      description:  banner.description,
      position:     banner.position,
      status:       banner.status,
      displayOrder: banner.displayOrder,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm(emptyForm);
    setIsEditing(false);
  };

  // ── create / update ────────────────────────────────────────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditing) {
        const { data } = await adminService.updateBanner(form.id, {
          title:        form.title,
          imageUrl:     form.imageUrl,
          link:         form.link,
          description:  form.description,
          position:     form.position,
          status:       form.status,
          displayOrder: form.displayOrder,
        });
        const updated = data?.data;
        setBanners((prev) => prev.map((b) => (b.bannerId === form.id ? updated : b)));
      } else {
        const { data } = await adminService.createBanner({
          title:        form.title,
          imageUrl:     form.imageUrl,
          link:         form.link,
          description:  form.description,
          position:     form.position,
          status:       form.status,
          displayOrder: form.displayOrder,
        });
        setBanners((prev) => [...prev, data?.data]);
      }
      handleCancel();
    } catch {
      alert(isEditing ? 'Failed to update banner.' : 'Failed to create banner.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (banner) => {
    if (!window.confirm(`Delete banner "${banner.title}"? This cannot be undone.`)) return;
    try {
      await adminService.deleteBanner(banner.bannerId);
      setBanners((prev) => prev.filter((b) => b.bannerId !== banner.bannerId));
    } catch {
      alert('Failed to delete banner.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Banners</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage homepage banners and promotional content.</p>
        </div>
        <button
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={handleAddClick}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Banner
        </button>
      </div>

      {/* Banner Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={handleCancel}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Banner' : 'Add Banner'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Image URL <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Link (optional)</label>
                <input
                  type="text"
                  name="link"
                  value={form.link}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Description (optional)</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Position</label>
                  <select
                    name="position"
                    value={form.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Display Order</label>
                <input
                  type="number"
                  name="displayOrder"
                  value={form.displayOrder}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={0}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
                >
                  {isSaving ? 'Saving…' : (isEditing ? 'Update' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
      )}

      {/* Banner List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Title', 'Image', 'Position', 'Status', 'Order', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-10 w-16 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
                    <td className="px-4 py-3"><div className="h-5 w-14 bg-gray-200 rounded-full" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-8 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="h-5 w-5 bg-gray-200 rounded" />
                        <div className="h-5 w-5 bg-gray-200 rounded" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-16">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No banners yet.</p>
            <p className="text-gray-400 text-sm mt-1">Add your first banner to display on the homepage.</p>
            <button
              className="mt-4 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              onClick={handleAddClick}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Banner
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map((banner) => (
                  <tr key={banner.bannerId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{banner.title}</td>
                    <td className="px-4 py-3 text-sm">
                      {banner.imageUrl ? (
                        <img src={banner.imageUrl} alt={banner.title} className="h-10 w-auto rounded" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {banner.link ? (
                        <a href={banner.link} className="text-blue-600 underline truncate max-w-[160px] block" target="_blank" rel="noopener noreferrer">{banner.link}</a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{banner.position}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${banner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {banner.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{banner.displayOrder}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditClick(banner)}
                          title="Edit banner"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(banner)}
                          title="Delete banner"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBanners;
