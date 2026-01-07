import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, X, Save, Trash2, Youtube } from 'lucide-react';
import { vibeVideosAPI } from '../config/api';
import { useToast } from '../contexts/ToastContext';
import { authAPI } from '../config/api';

const AdminVibeVideos = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [newVideoUrl, setNewVideoUrl] = useState('');

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
        fetchVideos();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      toast.error('Please login to continue');
      navigate('/login');
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await vibeVideosAPI.getVibeVideosAdmin();
      setVideos(response.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error(error.message || 'Failed to load vibe videos');
    } finally {
      setLoading(false);
    }
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    
    // If it's already just an ID, return it
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return url.length === 11 ? url : null;
    }
    
    // Extract ID from YouTube URL (including Shorts)
    // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID
    const regExp = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^#&?\/\s]{11})/;
    const match = url.match(regExp);
    return (match && match[1] && match[1].length === 11) ? match[1] : null;
  };

  const handleAddVideo = () => {
    if (!newVideoUrl.trim()) {
      toast.error('Please enter a YouTube video link');
      return;
    }

    const youtubeId = extractYouTubeId(newVideoUrl.trim());
    if (!youtubeId) {
      toast.error('Invalid YouTube URL. Please enter a valid YouTube or YouTube Shorts link');
      return;
    }

    // Check if video already exists
    const existingVideo = videos.find(v => {
      const existingId = extractYouTubeId(v.youtubeUrl);
      return existingId === youtubeId;
    });

    if (existingVideo) {
      toast.error('This video is already added');
      return;
    }

    const newVideo = {
      id: Date.now(), // Temporary ID
      youtubeUrl: newVideoUrl.trim(),
      title: `Video ${videos.length + 1}`,
      isTall: true
    };

    setVideos([...videos, newVideo]);
    setNewVideoUrl('');
    toast.success('Video added successfully');
  };

  const handleRemoveVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
    toast.success('Video removed');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await vibeVideosAPI.updateVibeVideos(videos);
      toast.success('Vibe videos updated successfully');
    } catch (error) {
      console.error('Error saving videos:', error);
      toast.error(error.message || 'Failed to save vibe videos');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddVideo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              🎬
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Manage Vibe Videos
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl">
            Add YouTube Short video links to display in the "Vibe with Us" section.
            Videos will be displayed in a grid layout on the homepage.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-[#017233]" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Add New Video */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Add YouTube Short Video Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter YouTube or YouTube Shorts URL (e.g., https://youtube.com/shorts/abc123 or https://youtu.be/abc123)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-transparent"
                />
                <button
                  onClick={handleAddVideo}
                  className="px-4 py-2 bg-[#017233] text-white rounded-lg hover:bg-[#015a28] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Supports YouTube URLs (youtube.com, youtu.be) and YouTube Shorts links
              </p>
            </div>

            {/* Videos List */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Current Videos ({videos.length})
              </label>
              {videos.length > 0 ? (
                <div className="space-y-3">
                  {videos.map((video, index) => {
                    const youtubeId = extractYouTubeId(video.youtubeUrl);
                    const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : null;
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {thumbnailUrl && (
                          <img
                            src={thumbnailUrl}
                            alt="Video thumbnail"
                            className="w-24 h-16 object-cover rounded"
                          />
                        )}
                        {!thumbnailUrl && (
                          <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <Youtube className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {video.youtubeUrl}
                          </p>
                          {youtubeId && (
                            <p className="text-xs text-gray-500">ID: {youtubeId}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveVideo(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove video"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No videos added yet. Add your first video above.</p>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-[#017233] to-[#01994d] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Videos
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVibeVideos;

