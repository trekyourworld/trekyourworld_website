import React, { useState } from 'react';

const initialBanners = [
  // Example initial data
  // { id: 1, title: 'Welcome Banner', imageUrl: '', link: '', description: '' },
];

const ManageBanners = () => {
  const [banners, setBanners] = useState(initialBanners);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: null, title: '', imageUrl: '', link: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setForm({ id: null, title: '', imageUrl: '', link: '', description: '' });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditClick = (banner) => {
    setForm(banner);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setBanners((prev) => prev.map((b) => (b.id === form.id ? { ...form } : b)));
    } else {
      setBanners((prev) => [
        ...prev,
        { ...form, id: Date.now() },
      ]);
    }
    setShowForm(false);
    setForm({ id: null, title: '', imageUrl: '', link: '', description: '' });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm({ id: null, title: '', imageUrl: '', link: '', description: '' });
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Banners</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={handleAddClick}
        >
          Add Banner
        </button>
      </div>

      {/* Banner Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Banner' : 'Add Banner'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Link (optional)</label>
                <input
                  type="text"
                  name="link"
                  value={form.link}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description (optional)</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {isEditing ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banner List */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        {banners.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No banners found.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{banner.title}</td>
                  <td className="px-4 py-2">
                    {banner.imageUrl ? (
                      <img src={banner.imageUrl} alt={banner.title} className="h-12 w-auto rounded" />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {banner.link ? (
                      <a href={banner.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{banner.link}</a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{banner.description || <span className="text-gray-400">-</span>}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEditClick(banner)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(banner.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageBanners;
