import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Loader2, X, Save, Upload, Image as ImageIcon, Search, ArrowUp, ArrowDown, Settings } from 'lucide-react';
import { driversAPI, uploadAPI, carBookingSettingsAPI } from '../config/api';
import { useToast } from '../contexts/ToastContext';
import { authAPI } from '../config/api';

const AdminDrivers = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showFiveSeaterOnly, setShowFiveSeaterOnly] = useState(false);
  const [settings, setSettings] = useState({
    features: [],
    formFields: {}
  });

  const [formData, setFormData] = useState({
    name: '',
    car: '',
    experience: '',
    photoUrl: '',
    status: 'active',
    displayOrder: 0,
    fiveDriver: false,
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
        fetchDrivers();
        fetchSettings();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      toast.error('Please login to continue');
      navigate('/login');
    }
  };

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await driversAPI.getAllDriversAdmin();
      setDrivers(response.drivers || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error(error.message || 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await carBookingSettingsAPI.getSettingsAdmin();
      setSettings({
        features: response.features || [],
        formFields: response.formFields || {}
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileUpload = async (file) => {
    try {
      setUploading(true);
      const result = await uploadAPI.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        photoUrl: result.url,
        photoPublicId: result.public_id
      }));
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        await driversAPI.updateDriver(editingDriver.id, formData);
        toast.success('Driver updated successfully!');
      } else {
        await driversAPI.createDriver(formData);
        toast.success('Driver created successfully!');
      }

      resetForm();
      fetchDrivers();
    } catch (error) {
      console.error('Error saving driver:', error);
      toast.error(error.message || 'Failed to save driver');
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name || '',
      car: driver.car || '',
      experience: driver.experience || '',
      photoUrl: driver.photoUrl || '',
      status: driver.status || 'active',
      displayOrder: driver.displayOrder || 0,
      fiveDriver: driver.fiveDriver || false,
      photoPublicId: driver.photoPublicId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this driver? This action cannot be undone.')) {
      return;
    }

    try {
      await driversAPI.deleteDriver(id);
      toast.success('Driver deleted successfully!');
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error(error.message || 'Failed to delete driver');
    }
  };

  const handleMoveOrder = async (id, direction) => {
    const driver = drivers.find(d => d.id === id);
    if (!driver) return;

    const currentOrder = driver.displayOrder || 0;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;

    try {
      await driversAPI.updateDriver(id, { displayOrder: newOrder });
      toast.success('Driver order updated!');
      fetchDrivers();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      car: '',
      experience: '',
      photoUrl: '',
      status: 'active',
      displayOrder: 0,
      fiveDriver: false,
    });
    setEditingDriver(null);
    setShowForm(false);
  };

  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      await carBookingSettingsAPI.updateSettings(settings);
      toast.success('Settings saved successfully!');
      setShowSettings(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    }
  };

  const addFeature = () => {
    setSettings(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index, value) => {
    setSettings(prev => {
      const newFeatures = [...prev.features];
      newFeatures[index] = value;
      return { ...prev, features: newFeatures };
    });
  };

  const removeFeature = (index) => {
    setSettings(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const filteredDrivers = drivers.filter(driver => {
    // First filter by 5-seater if toggle is on
    if (showFiveSeaterOnly && !driver.fiveDriver) {
      return false;
    }
    
    // Then filter by search term
    if (searchTerm) {
      return (
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (searchTerm.toLowerCase().includes('five') && driver.fiveDriver) ||
        (searchTerm.toLowerCase().includes('5') && driver.fiveDriver) ||
        (searchTerm.toLowerCase().includes('seater') && driver.fiveDriver)
      );
    }
    
    return true;
  });

  const fiveSeaterDrivers = drivers.filter(driver => driver.fiveDriver);

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
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Manage Drivers & Car Booking
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Manage driver profiles and car booking settings</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Settings</span>
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Add Driver</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        {!showForm && !showSettings && (
          <div className="mb-4 sm:mb-6 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search drivers by name or car..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
              />
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => setShowFiveSeaterOnly(!showFiveSeaterOnly)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                  showFiveSeaterOnly
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Show Only 5 Seater Drivers
                {fiveSeaterDrivers.length > 0 && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {fiveSeaterDrivers.length}
                  </span>
                )}
              </button>
              {showFiveSeaterOnly && (
                <span className="text-sm text-gray-600">
                  Showing {filteredDrivers.length} of {fiveSeaterDrivers.length} five-seater drivers
                </span>
              )}
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-2 sm:p-4 overflow-y-auto pt-20 sm:pt-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between z-10 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Car Booking Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Features */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Car Features</label>
                  {settings.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter feature"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    + Add Feature
                  </button>
                </div>

                {/* Form Fields Info */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Form Fields</label>
                  <p className="text-sm text-gray-600 mb-4">
                    Form fields are currently managed in the code. Future updates will allow full customization here.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500">
                      Available fields: First Name, Last Name, Mobile Number, Email, From Date, To Date, Number of Adults, Number of Children, Five Driver (5 Seater Car)
                    </p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Settings
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-2 sm:p-4 overflow-y-auto pt-20 sm:pt-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between z-10 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {editingDriver ? 'Edit Driver' : 'Add New Driver'}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., Mr. Anup Kumar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Car *</label>
                  <input
                    type="text"
                    name="car"
                    value={formData.car}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., Innova Crysta- 7 Seater"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., 35+ Years of Experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Photo</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors cursor-pointer flex items-center gap-2"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                      Upload Photo
                    </label>
                    {formData.photoUrl && (
                      <img src={formData.photoUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <input
                    type="checkbox"
                    id="fiveDriver"
                    name="fiveDriver"
                    checked={formData.fiveDriver}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="fiveDriver" className="text-sm font-semibold text-gray-700 cursor-pointer">
                    5 Seater Car / Five Driver
                  </label>
                  <span className="text-xs text-gray-500 ml-2">(Mark this driver as available for 5-seater car bookings)</span>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingDriver ? 'Update Driver' : 'Create Driver'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Drivers List */}
        {!showForm && !showSettings && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {filteredDrivers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No drivers found
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredDrivers.map((driver) => (
                  <div key={driver.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {driver.photoUrl ? (
                          <img
                            src={driver.photoUrl}
                            alt={driver.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                          {driver.fiveDriver && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                              5 Seater
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{driver.car}</p>
                        <p className="text-sm text-gray-500">{driver.experience}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMoveOrder(driver.id, 'up')}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Move up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveOrder(driver.id, 'down')}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Move down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(driver)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(driver.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDrivers;

