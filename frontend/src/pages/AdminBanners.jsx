import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Loader2, X, Save, Upload, Image as ImageIcon, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { bannersAPI, uploadAPI } from '../config/api';
import { useToast } from '../contexts/ToastContext';
import { authAPI } from '../config/api';

const AdminBanners = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    subtitle: '',
    displayOrder: 0,
    status: 'active',
  });

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.user) {
        setUser(response.user);
        if (response.user.role !== 'admin' && response.user.role !== 'main_admin') {
          toast.error('Access denied. Admin privileges required.');
          navigate('/');
          return;
        }
        fetchBanners();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      toast.error('Please login to continue');
      navigate('/login');
    }
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannersAPI.getAllBannersAdmin();
      setBanners(response.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error(error.message || 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadAPI.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: response.url,
        imagePublicId: response.public_id,
      }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.imageUrl) {
      toast.error('Please upload a banner image');
      return;
    }
    
    try {
      if (editingBanner) {
        await bannersAPI.updateBanner(editingBanner.id, formData);
        toast.success('Banner updated successfully!');
      } else {
        await bannersAPI.createBanner(formData);
        toast.success('Banner created successfully!');
      }

      resetForm();
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error(error.message || 'Failed to save banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      imageUrl: banner.imageUrl || '',
      imagePublicId: banner.imagePublicId || '',
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      displayOrder: banner.displayOrder || 0,
      status: banner.status || 'active',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner? This action cannot be undone.')) {
      return;
    }

    try {
      await bannersAPI.deleteBanner(id);
      toast.success('Banner deleted successfully!');
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error(error.message || 'Failed to delete banner');
    }
  };

  const handleMoveOrder = async (id, direction) => {
    const banner = banners.find(b => b.id === id);
    if (!banner) return;

    const currentOrder = banner.displayOrder || 0;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;

    try {
      await bannersAPI.updateBanner(id, { displayOrder: newOrder });
      toast.success('Banner order updated');
      fetchBanners();
    } catch (error) {
      console.error('Error updating banner order:', error);
      toast.error(error.message || 'Failed to update banner order');
    }
  };

  const resetForm = () => {
    setFormData({
      imageUrl: '',
      title: '',
      subtitle: '',
      displayOrder: 0,
      status: 'active',
    });
    setEditingBanner(null);
    setShowForm(false);
  };

  const filteredBanners = banners.filter(banner =>
    banner.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by display order
  const sortedBanners = [...filteredBanners].sort((a, b) => {
    const orderA = a.displayOrder || 0;
    const orderB = b.displayOrder || 0;
    if (orderA !== orderB) return orderA - orderB;
    return a.id - b.id;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Manage Banners
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Create, edit, and manage homepage banner slider</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">Add New Banner</span>
          </button>
        </div>

        {!showForm && (
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search banners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
              />
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-2 sm:p-4 overflow-y-auto pt-20 sm:pt-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between z-10 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Image *</label>
                  <div className="space-y-3">
                    {formData.imageUrl && (
                      <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={formData.imageUrl}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        )}
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter banner title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter banner subtitle"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    {editingBanner ? 'Update Banner' : 'Create Banner'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {!showForm && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="block sm:hidden">
              {sortedBanners.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No banners found</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {sortedBanners.map((banner) => (
                    <div key={banner.id} className="p-4 hover:bg-gray-50">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                          {banner.imageUrl ? (
                            <img src={banner.imageUrl} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Order: {banner.displayOrder || 0}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              banner.status === 'active' ? 'bg-green-100 text-green-700' :
                              banner.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {banner.status}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{banner.title || 'No title'}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{banner.subtitle || 'No subtitle'}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleMoveOrder(banner.id, 'up')}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Move up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMoveOrder(banner.id, 'down')}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Move down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(banner)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(banner.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Order</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Image</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Title</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Subtitle</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedBanners.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        No banners found
                      </td>
                    </tr>
                  ) : (
                    sortedBanners.map((banner) => (
                      <tr key={banner.id} className="hover:bg-gray-50">
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{banner.displayOrder || 0}</span>
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleMoveOrder(banner.id, 'up')}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Move up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleMoveOrder(banner.id, 'down')}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Move down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                            {banner.imageUrl ? (
                              <img src={banner.imageUrl} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">{banner.title || 'No title'}</span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-700 text-sm sm:text-base line-clamp-2">{banner.subtitle || 'No subtitle'}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            banner.status === 'active' ? 'bg-green-100 text-green-800' :
                            banner.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {banner.status}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handleEdit(banner)}
                              className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(banner.id)}
                              className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBanners;

