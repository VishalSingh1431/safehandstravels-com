import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Edit2, Save, X, Loader2, LogOut } from 'lucide-react';
import { authAPI } from '../config/api';
import { useToast } from '../contexts/ToastContext';

const Profile = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getCurrentUser();
      if (response.user) {
        setUser(response.user);
        setFormData({
          name: response.user.name || '',
          phone: response.user.phone || '',
          bio: response.user.bio || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error(error.message || 'Failed to load profile');
      if (error.message?.includes('token') || error.message?.includes('unauthorized')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const response = await authAPI.updateProfile({
        name: formData.name.trim() || null,
        phone: formData.phone.trim() || null,
        bio: formData.bio.trim() || null,
      });

      if (response.user) {
        setUser(response.user);
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        // Dispatch event to update navbar
        window.dispatchEvent(new Event('authChange'));
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || user.email}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {user.name || 'User'}
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-white/90 mb-4">
                  <Mail className="w-5 h-5" />
                  <span>{user.email}</span>
                </div>
                {user.role && (
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
                    {user.role === 'admin' ? 'Administrator' : 'User'}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Edit2 className="w-5 h-5" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {user.name || 'Not set'}
                  </div>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-600 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{user.email}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>{user.phone || 'Not set'}</span>
                  </div>
                )}
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <div>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 resize-none"
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.bio && (
                        <p className="text-sm text-red-600">{errors.bio}</p>
                      )}
                      <p className="text-xs text-gray-500 ml-auto">
                        {formData.bio.length}/500 characters
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 min-h-[100px]">
                    {user.bio || 'No bio added yet'}
                  </div>
                )}
              </div>

              {/* Account Info */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-gray-900 font-medium">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-gray-900 font-medium">
                      {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all duration-300 flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

