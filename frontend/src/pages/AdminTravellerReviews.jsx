import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Loader2, X, Save, Image as ImageIcon, Search, Star, Video, FileText, Filter } from 'lucide-react';
import { reviewsAPI, writtenReviewsAPI, uploadAPI } from '../config/api';
import { useToast } from '../contexts/ToastContext';
import { authAPI } from '../config/api';

const AdminTravellerReviews = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [videoReviews, setVideoReviews] = useState([]);
  const [writtenReviews, setWrittenReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewType, setReviewType] = useState('video'); // 'video' or 'written'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'video', 'written'
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    location: '',
    review: '',
    avatar: '',
    avatarPublicId: '',
    type: 'video',
    videoUrl: '',
    videoPublicId: '',
    date: '',
    title: '',
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
        fetchAllReviews();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      toast.error('Please login to continue');
      navigate('/login');
    }
  };

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const [videoRes, writtenRes] = await Promise.all([
        reviewsAPI.getAllReviewsAdmin(),
        writtenReviewsAPI.getAllWrittenReviewsAdmin()
      ]);
      setVideoReviews(videoRes.reviews || []);
      setWrittenReviews(writtenRes.writtenReviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error(error.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    
    // If it's already just an ID, return it
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return url.length === 11 ? url : null;
    }
    
    // Extract ID from YouTube URL (including Shorts)
    const regExp = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^#&?\/\s]{11})/;
    const match = url.match(regExp);
    return (match && match[1] && match[1].length === 11) ? match[1] : null;
  };

  const handleFileUpload = async (file, type = 'image') => {
    try {
      setUploading(true);
      const result = await uploadAPI.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        avatar: result.url,
        avatarPublicId: result.public_id
      }));
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleYouTubeUrlChange = (url) => {
    const youtubeId = extractYouTubeId(url);
    if (youtubeId) {
      setFormData(prev => ({
        ...prev,
        videoUrl: url.trim()
      }));
    } else if (url.trim() === '') {
      setFormData(prev => ({
        ...prev,
        videoUrl: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (reviewType === 'video') {
      if (!formData.videoUrl) {
        toast.error('Please enter a YouTube video link');
        return;
      }
      const youtubeId = extractYouTubeId(formData.videoUrl);
      if (!youtubeId) {
        toast.error('Invalid YouTube URL. Please enter a valid YouTube or YouTube Shorts link');
        return;
      }
    }
    
    if (reviewType === 'written' && !formData.review) {
      toast.error('Please enter review text');
      return;
    }
    
    try {
      if (editingReview) {
        if (reviewType === 'video') {
          await reviewsAPI.updateReview(editingReview.id, formData);
          toast.success('Video review updated successfully!');
        } else {
          await writtenReviewsAPI.updateWrittenReview(editingReview.id, formData);
          toast.success('Written review updated successfully!');
        }
      } else {
        if (reviewType === 'video') {
          await reviewsAPI.createReview(formData);
          toast.success('Video review created successfully!');
        } else {
          await writtenReviewsAPI.createWrittenReview(formData);
          toast.success('Written review created successfully!');
        }
      }

      resetForm();
      fetchAllReviews();
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error(error.message || 'Failed to save review');
    }
  };

  const handleEdit = (review, type) => {
    setEditingReview(review);
    setReviewType(type);
    setFormData({
      name: review.name || '',
      rating: review.rating || 5,
      location: review.location || '',
      review: review.review || '',
      avatar: review.avatar || '',
      avatarPublicId: review.avatarPublicId || '',
      type: type,
      videoUrl: review.videoUrl || '',
      videoPublicId: review.videoPublicId || '',
      date: review.date || '',
      title: review.title || '',
      status: review.status || 'active',
    });
    setShowForm(true);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type} review? This action cannot be undone.`)) {
      return;
    }

    try {
      if (type === 'video') {
        await reviewsAPI.deleteReview(id);
      } else {
        await writtenReviewsAPI.deleteWrittenReview(id);
      }
      toast.success('Review deleted successfully!');
      fetchAllReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      rating: 5,
      location: '',
      review: '',
      avatar: '',
      avatarPublicId: '',
      type: 'video',
      videoUrl: '',
      videoPublicId: '',
      date: '',
      title: '',
      status: 'active',
    });
    setEditingReview(null);
    setReviewType('video');
    setShowForm(false);
  };

  const allReviews = [
    ...videoReviews.map(r => ({ ...r, _type: 'video', _uniqueKey: `video-${r.id}` })),
    ...writtenReviews.map(r => ({ ...r, _type: 'written', _uniqueKey: `written-${r.id}` }))
  ].sort((a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0));

  const filteredReviews = allReviews.filter(rev => {
    const matchesSearch = 
      rev.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.review?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || rev._type === filterType;
    
    return matchesSearch && matchesFilter;
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
              Manage Traveller Reviews
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Create, edit, and manage all traveler reviews</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                resetForm();
                setReviewType('video');
                setShowForm(true);
              }}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Video className="w-4 h-4" />
              <span className="whitespace-nowrap">Add Video Review</span>
            </button>
            <button
              onClick={() => {
                resetForm();
                setReviewType('written');
                setShowForm(true);
              }}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <FileText className="w-4 h-4" />
              <span className="whitespace-nowrap">Add Written Review</span>
            </button>
          </div>
        </div>

        {!showForm && (
          <>
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-2 border-gray-200'}`}
                >
                  All ({allReviews.length})
                </button>
                <button
                  onClick={() => setFilterType('video')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${filterType === 'video' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border-2 border-gray-200'}`}
                >
                  <Video className="w-4 h-4" />
                  Video ({videoReviews.length})
                </button>
                <button
                  onClick={() => setFilterType('written')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${filterType === 'written' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-2 border-gray-200'}`}
                >
                  <FileText className="w-4 h-4" />
                  Written ({writtenReviews.length})
                </button>
              </div>
            </div>
          </>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-2 sm:p-4 overflow-y-auto pt-20 sm:pt-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between z-10 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {editingReview ? `Edit ${reviewType === 'video' ? 'Video' : 'Written'} Review` : `Create New ${reviewType === 'video' ? 'Video' : 'Written'} Review`}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating *</label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {reviewType === 'written' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                        <input
                          type="text"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          placeholder="e.g., 2 weeks ago"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Review *</label>
                      <textarea
                        name="review"
                        value={formData.review}
                        onChange={handleInputChange}
                        required={reviewType === 'written'}
                        rows={4}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </>
                )}

                {reviewType === 'video' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube Video Link *</label>
                      <input
                        type="text"
                        value={formData.videoUrl}
                        onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                        placeholder="Enter YouTube or YouTube Shorts URL (e.g., https://youtube.com/shorts/abc123 or https://youtu.be/abc123)"
                        required
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supports YouTube URLs (youtube.com, youtu.be) and YouTube Shorts links
                      </p>
                      {formData.videoUrl && extractYouTubeId(formData.videoUrl) && (
                        <div className="mt-3">
                          <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                            <iframe
                              src={`https://www.youtube.com/embed/${extractYouTubeId(formData.videoUrl)}`}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title="YouTube video preview"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Review Text</label>
                      <textarea
                        name="review"
                        value={formData.review}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Optional review text"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Avatar</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors cursor-pointer flex items-center gap-2 text-sm sm:text-base"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                      Upload Avatar
                    </label>
                    {formData.avatar && (
                      <img src={formData.avatar} alt="Avatar" className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full" />
                    )}
                  </div>
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

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    {editingReview ? 'Update Review' : 'Create Review'}
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
              {filteredReviews.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No reviews found</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredReviews.map((rev) => (
                    <div key={rev._uniqueKey || `${rev._type}-${rev.id}`} className="p-4 hover:bg-gray-50">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          {rev.avatar ? (
                            <img
                              src={rev.avatar}
                              alt={rev.name}
                              className="w-16 h-16 object-cover rounded-full"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{rev.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              rev._type === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {rev._type === 'video' ? <Video className="w-3 h-3 inline" /> : <FileText className="w-3 h-3 inline" />} {rev._type === 'video' ? 'Video' : 'Written'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{rev.location}</p>
                          {rev.title && <p className="text-sm font-semibold text-gray-800 mb-1">{rev.title}</p>}
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < rev.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">{rev.review}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(rev, rev._type)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(rev.id, rev._type)}
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
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Avatar</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Rating</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Review</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        No reviews found
                      </td>
                    </tr>
                  ) : (
                    filteredReviews.map((rev) => (
                      <tr key={rev._uniqueKey || `${rev._type}-${rev.id}`} className="hover:bg-gray-50">
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          {rev.avatar ? (
                            <img
                              src={rev.avatar}
                              alt={rev.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">{rev.name}</span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                            rev._type === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {rev._type === 'video' ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                            {rev._type === 'video' ? 'Video' : 'Written'}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < rev.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-700 text-sm sm:text-base">{rev.location}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-700 text-sm sm:text-base line-clamp-2">{rev.review || rev.title}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handleEdit(rev, rev._type)}
                              className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(rev.id, rev._type)}
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

export default AdminTravellerReviews;

