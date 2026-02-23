import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, Loader2, X, Save, Upload, Image as ImageIcon, Search, MapPin, ChevronDown } from 'lucide-react';
import { tripsAPI, uploadAPI, blogsAPI } from '../config/api';
import { useToast } from '../contexts/ToastContext';
import { authAPI } from '../config/api';

// List of major Indian cities
const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Amritsar',
  'Navi Mumbai', 'Allahabad', 'Howrah', 'Gwalior', 'Jabalpur', 'Coimbatore', 'Vijayawada',
  'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubli-Dharwad',
  'Tiruchirappalli', 'Bareilly', 'Moradabad', 'Mysore', 'Gurgaon', 'Aligarh', 'Jalandhar',
  'Tirunelveli', 'Bhubaneswar', 'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur',
  'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack',
  'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol',
  'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain',
  'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli-Miraj', 'Mangalore',
  'Erode', 'Belgaum', 'Kurnool', 'Ambattur', 'Rajahmundry', 'Tiruppur', 'Kakinada',
  'Nizamabad', 'Parbhani', 'Puducherry', 'Shimla', 'Panaji', 'Port Blair', 'Kavaratti',
  'Aizawl', 'Agartala', 'Gangtok', 'Itanagar', 'Kohima', 'Imphal', 'Shillong', 'Dispur'
].sort();

const AdminTrips = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState({ image: false, gallery: false, heroImages: false });
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [recommendedTripsSearch, setRecommendedTripsSearch] = useState('');
  const [showRecommendedTripsDropdown, setShowRecommendedTripsDropdown] = useState(false);
  const [availableTrips, setAvailableTrips] = useState([]); // All trips for recommended trips dropdown
  const [relatedBlogsSearch, setRelatedBlogsSearch] = useState('');
  const [showRelatedBlogsDropdown, setShowRelatedBlogsDropdown] = useState(false);
  const [availableBlogs, setAvailableBlogs] = useState([]); // All blogs for related blogs dropdown

  const [formData, setFormData] = useState({
    title: '',
    location: [],
    duration: '',
    price: '',
    oldPrice: '',
    imageUrl: '',
    videoUrl: '',
    subtitle: '',
    intro: '',
    category: [],
    whyVisit: [''],
    itinerary: [{ day: 'Day 1', title: '', activities: '' }],
    included: [''],
    notIncluded: [''],
    notes: [''],
    faq: [{ question: '', answer: '' }],
    reviews: [{ rating: 5, text: '', author: '' }],
    gallery: [],
    heroImages: [],
    heroImagesPublicIds: [],
    recommendedTrips: [],
    status: 'active',
    enquiryFormType: 'form1',
  });

  const categoryOptions = ['Spiritual', 'Cultural', 'Heritage', 'Wellness', 'Wildlife', 'Adventure'];
  const locationDropdownRef = useRef(null);
  const recommendedTripsDropdownRef = useRef(null);
  const relatedBlogsDropdownRef = useRef(null);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (recommendedTripsDropdownRef.current && !recommendedTripsDropdownRef.current.contains(event.target)) {
        setShowRecommendedTripsDropdown(false);
      }
      if (relatedBlogsDropdownRef.current && !relatedBlogsDropdownRef.current.contains(event.target)) {
        setShowRelatedBlogsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredCities = locationSearch
    ? INDIAN_CITIES.filter(city =>
      city.toLowerCase().includes(locationSearch.toLowerCase())
    )
    : INDIAN_CITIES;

  const handleLocationSelect = (city) => {
    setFormData(prev => {
      const currentLocations = prev.location || [];
      if (currentLocations.includes(city)) {
        return prev; // Already selected
      }
      return { ...prev, location: [...currentLocations, city] };
    });
    setLocationSearch('');
    setShowLocationDropdown(false);
  };

  const removeLocation = (city) => {
    setFormData(prev => ({
      ...prev,
      location: (prev.location || []).filter(loc => loc !== city)
    }));
  };

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
        fetchTrips();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      toast.error('Please login to continue');
      navigate('/login');
    }
  };

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await tripsAPI.getAllTripsAdmin();
      setTrips(response.trips || []);
      setAvailableTrips(response.trips || []); // Store all trips for recommended trips dropdown

      // Also fetch blogs for related blogs dropdown
      try {
        const blogsResponse = await blogsAPI.getAllBlogsAdmin('', '', '', '', 100, 0);
        let blogs = [];
        if (Array.isArray(blogsResponse)) {
          blogs = blogsResponse;
        } else if (blogsResponse?.blogs && Array.isArray(blogsResponse.blogs)) {
          blogs = blogsResponse.blogs;
        } else if (blogsResponse?.data && Array.isArray(blogsResponse.data)) {
          blogs = blogsResponse.data;
        } else if (blogsResponse && typeof blogsResponse === 'object') {
          for (const key of ['blogs', 'data', 'items', 'results']) {
            if (Array.isArray(blogsResponse[key])) {
              blogs = blogsResponse[key];
              break;
            }
          }
        }
        setAvailableBlogs(blogs);
      } catch (error) {
        console.error('Error fetching blogs for dropdown:', error);
        setAvailableBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast.error(error.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  // Filter trips for recommended trips dropdown
  const filteredRecommendedTrips = availableTrips.filter(trip => {
    if (!trip || editingTrip?.id === trip.id) return false; // Exclude current trip
    if (!recommendedTripsSearch) return true;
    const searchLower = recommendedTripsSearch.toLowerCase();
    return (
      trip.title?.toLowerCase().includes(searchLower) ||
      (Array.isArray(trip.location) ? trip.location.join(', ') : trip.location)?.toLowerCase().includes(searchLower)
    );
  });

  const handleRecommendedTripSelect = (tripId) => {
    const selectedTrip = availableTrips.find(t => t.id === tripId);
    if (!selectedTrip) return;

    setFormData(prev => {
      const currentRecommended = prev.recommendedTrips || [];
      if (currentRecommended.includes(tripId)) {
        return prev; // Already selected
      }
      return { ...prev, recommendedTrips: [...currentRecommended, tripId] };
    });
    setRecommendedTripsSearch('');
    setShowRecommendedTripsDropdown(false);
  };

  const removeRecommendedTrip = (tripId) => {
    setFormData(prev => ({
      ...prev,
      recommendedTrips: (prev.recommendedTrips || []).filter(id => id !== tripId)
    }));
  };

  // Filter blogs for related blogs dropdown
  const filteredRelatedBlogs = availableBlogs.filter(blog => {
    if (!blog) {
      console.log('Filter: blog is null/undefined');
      return false;
    }
    // Include all blogs (published, draft) for admin - blogs use 'published' status, not 'active'
    if (!relatedBlogsSearch) {
      return true; // Show all blogs when no search
    }
    const searchLower = relatedBlogsSearch.toLowerCase();
    const matches = (
      blog.title?.toLowerCase().includes(searchLower) ||
      blog.description?.toLowerCase().includes(searchLower) ||
      (blog.category && typeof blog.category === 'string' && blog.category.toLowerCase().includes(searchLower))
    );
    return matches;
  });

  const handleRelatedBlogSelect = (blogId) => {
    const selectedBlog = availableBlogs.find(b => b.id === blogId);
    if (!selectedBlog) return;

    setFormData(prev => {
      const currentRelated = prev.relatedBlogs || [];
      if (currentRelated.includes(blogId)) {
        return prev; // Already selected
      }
      return { ...prev, relatedBlogs: [...currentRelated, blogId] };
    });
    setRelatedBlogsSearch('');
    setShowRelatedBlogsDropdown(false);
  };

  const removeRelatedBlog = (blogId) => {
    setFormData(prev => ({
      ...prev,
      relatedBlogs: (prev.relatedBlogs || []).filter(id => id !== blogId)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle location search separately (not in formData)
    if (name === 'locationSearch') {
      setLocationSearch(value);
      setShowLocationDropdown(true);
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => {
      const currentCategories = prev.category || [];
      if (currentCategories.includes(category)) {
        return { ...prev, category: currentCategories.filter(c => c !== category) };
      } else {
        return { ...prev, category: [...currentCategories, category] };
      }
    });
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };



  const handleFileUpload = async (file, type) => {
    try {
      setUploading(prev => ({ ...prev, [type]: true }));

      let result;
      if (type === 'image' || type === 'gallery' || type === 'heroImages') {
        result = await uploadAPI.uploadImage(file);
      }

      if (type === 'image') {
        setFormData(prev => ({
          ...prev,
          imageUrl: result.url,
          imagePublicId: result.public_id
        }));
        toast.success('Image uploaded successfully!');
      } else if (type === 'gallery') {
        setFormData(prev => ({
          ...prev,
          gallery: [...prev.gallery, result.url],
          galleryPublicIds: [...(prev.galleryPublicIds || []), result.public_id]
        }));
        toast.success('Gallery image uploaded!');
      } else if (type === 'heroImages') {
        setFormData(prev => ({
          ...prev,
          heroImages: [...(prev.heroImages || []), result.url],
          heroImagesPublicIds: [...(prev.heroImagesPublicIds || []), result.public_id]
        }));
        toast.success('Hero image uploaded!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleMultipleGalleryUpload = async (files) => {
    if (!files || files.length === 0) return;

    try {
      setUploading(prev => ({ ...prev, gallery: true }));

      const uploadPromises = Array.from(files).map(file => uploadAPI.uploadImage(file));
      const results = await Promise.all(uploadPromises);

      const newUrls = results.map(r => r.url);
      const newPublicIds = results.map(r => r.public_id);

      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...newUrls],
        galleryPublicIds: [...(prev.galleryPublicIds || []), ...newPublicIds]
      }));

      toast.success(`${results.length} gallery image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      toast.error(error.message || 'Failed to upload gallery images');
    } finally {
      setUploading(prev => ({ ...prev, gallery: false }));
    }
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url) => {
    if (!url) return '';

    // If it's already just an ID, return it
    if (!url.includes('youtube.com') && !url.includes('youtu.be') && url.length === 11) {
      return url;
    }

    // Extract ID from YouTube URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate category
    if (!formData.category || formData.category.length === 0) {
      toast.error('Please select at least one category tag');
      return;
    }

    // Validate location
    if (!formData.location || formData.location.length === 0) {
      toast.error('Please select at least one location');
      return;
    }

    try {
      const tripData = {
        ...formData,
        category: formData.category || [],
        whyVisit: formData.whyVisit.filter(v => v.trim()),
        included: formData.included.filter(v => v.trim()),
        notIncluded: formData.notIncluded.filter(v => v.trim()),
        notes: formData.notes.filter(v => v.trim()),
        itinerary: formData.itinerary.filter(i => i.title.trim() || i.activities.trim()),
        faq: formData.faq.filter(f => f.question.trim() || f.answer.trim()),
        reviews: formData.reviews.filter(r => r.text.trim()),
        recommendedTrips: Array.isArray(formData.recommendedTrips) ? formData.recommendedTrips : [], // Explicitly include recommended trips as array
        relatedBlogs: Array.isArray(formData.relatedBlogs) ? formData.relatedBlogs : [], // Explicitly include related blogs as array
        seatsLeft: formData.seatsLeft ? formData.seatsLeft : null, // Convert empty string to null
      };

      console.log('Saving trip with seatsLeft:', tripData.seatsLeft); // Debug log

      console.log('Saving trip with recommendedTrips:', tripData.recommendedTrips); // Debug log
      console.log('Saving trip with relatedBlogs:', tripData.relatedBlogs); // Debug log

      if (editingTrip) {
        await tripsAPI.updateTrip(editingTrip.id, tripData);
        toast.success('Trip updated successfully!');
      } else {
        await tripsAPI.createTrip(tripData);
        toast.success('Trip created successfully!');
      }

      resetForm();
      fetchTrips();
    } catch (error) {
      console.error('Error saving trip:', error);
      toast.error(error.message || 'Failed to save trip');
    }
  };

  const handleEdit = async (trip) => {
    console.log('Editing trip - recommendedTrips:', trip.recommendedTrips); // Debug log
    setEditingTrip(trip);
    const recommendedTripsData = Array.isArray(trip.recommendedTrips)
      ? trip.recommendedTrips
      : (trip.recommendedTrips ? [trip.recommendedTrips] : []);
    const relatedBlogsData = Array.isArray(trip.relatedBlogs)
      ? trip.relatedBlogs
      : (trip.relatedBlogs ? [trip.relatedBlogs] : []);
    console.log('Setting recommendedTrips in form:', recommendedTripsData); // Debug log
    console.log('Setting relatedBlogs in form:', relatedBlogsData); // Debug log
    setFormData({
      title: trip.title || '',
      location: Array.isArray(trip.location) ? trip.location : (trip.location ? [trip.location] : []),
      duration: trip.duration || '',
      price: trip.price || '',
      oldPrice: trip.oldPrice || '',
      seatsLeft: trip.seatsLeft || '',
      imageUrl: trip.imageUrl || trip.image || '',
      videoUrl: trip.videoUrl || trip.video || '',
      subtitle: trip.subtitle || '',
      intro: trip.intro || '',
      category: trip.category || [],
      whyVisit: trip.whyVisit && trip.whyVisit.length > 0 ? trip.whyVisit : [''],
      itinerary: trip.itinerary && trip.itinerary.length > 0
        ? trip.itinerary.map((i) => ({
          day: i.day || '',
          title: i.title || '',
          activities: i.activities || '',
        }))
        : [{ day: 'Day 1', title: '', activities: '' }],
      included: trip.included && trip.included.length > 0 ? trip.included : [''],
      notIncluded: trip.notIncluded && trip.notIncluded.length > 0 ? trip.notIncluded : [''],
      notes: trip.notes && trip.notes.length > 0 ? trip.notes : [''],
      faq: trip.faq && trip.faq.length > 0 ? trip.faq : [{ question: '', answer: '' }],
      reviews: trip.reviews && trip.reviews.length > 0 ? trip.reviews : [{ rating: 5, text: '', author: '' }],
      gallery: trip.gallery || [],
      galleryPublicIds: trip.galleryPublicIds || [],
      heroImages: trip.heroImages || [],
      heroImagesPublicIds: trip.heroImagesPublicIds || [],
      imagePublicId: trip.imagePublicId,
      recommendedTrips: recommendedTripsData,
      relatedBlogs: relatedBlogsData,
      status: trip.status || 'active',
      enquiryFormType: trip.enquiryFormType === 'form2' ? 'form2' : 'form1',
    });
    setShowLocationDropdown(false);
    setShowForm(true);

    // Ensure blogs are loaded when form opens
    if (availableBlogs.length === 0) {
      try {
        const blogsResponse = await blogsAPI.getAllBlogsAdmin('', '', '', '', 100, 0);
        const blogs = Array.isArray(blogsResponse)
          ? blogsResponse
          : (blogsResponse?.blogs && Array.isArray(blogsResponse.blogs))
            ? blogsResponse.blogs
            : (blogsResponse?.data && Array.isArray(blogsResponse.data))
              ? blogsResponse.data
              : [];
        if (blogs.length > 0) setAvailableBlogs(blogs);
      } catch (error) {
        console.error('Error fetching blogs when opening form:', error);
      }
    } else {
      console.log('Blogs already loaded:', availableBlogs.length);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return;
    }

    try {
      await tripsAPI.deleteTrip(id);
      toast.success('Trip deleted successfully!');
      fetchTrips();
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast.error(error.message || 'Failed to delete trip');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: [],
      duration: '',
      price: '',
      oldPrice: '',
      seatsLeft: '',
      imageUrl: '',
      videoUrl: '',
      subtitle: '',
      intro: '',
      category: [],
      whyVisit: [''],
      itinerary: [{ day: 'Day 1', title: '', activities: '' }],
      included: [''],
      notIncluded: [''],
      notes: [''],
      faq: [{ question: '', answer: '' }],
      reviews: [{ rating: 5, text: '', author: '' }],
      gallery: [],
      heroImages: [],
      heroImagesPublicIds: [],
      recommendedTrips: [],
      relatedBlogs: [],
      status: 'active',
      enquiryFormType: 'form1',
    });
    setLocationSearch('');
    setShowLocationDropdown(false);
    setRecommendedTripsSearch('');
    setRelatedBlogsSearch('');
    setShowRecommendedTripsDropdown(false);
    setEditingTrip(null);
    setShowForm(false);
  };

  const filteredTrips = trips.filter(trip => {
    const tripLocation = Array.isArray(trip.location) ? trip.location.join(', ') : (trip.location || '');
    return (
      trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tripLocation.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Manage Trips
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Create, edit, and manage trip packages</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">Add New Trip</span>
          </button>
        </div>

        {/* Search */}
        {!showForm && (
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search trips by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-2 sm:p-4 overflow-y-auto pt-20 sm:pt-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between z-10 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {editingTrip ? 'Edit Trip' : 'Create New Trip'}
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
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="relative" ref={locationDropdownRef}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Locations *</label>

                    {/* Selected Locations */}
                    {formData.location && formData.location.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.location.map((city) => (
                          <span
                            key={city}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>{city}</span>
                            <button
                              type="button"
                              onClick={() => removeLocation(city)}
                              className="ml-1 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="relative">
                      <input
                        type="text"
                        name="locationSearch"
                        value={locationSearch}
                        onChange={handleInputChange}
                        onFocus={() => setShowLocationDropdown(true)}
                        placeholder="Type to search and add cities..."
                        className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

                      {showLocationDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {filteredCities.length > 0 ? (
                            filteredCities
                              .filter(city => !formData.location?.includes(city)) // Filter out already selected
                              .slice(0, 50)
                              .map((city) => (
                                <button
                                  key={city}
                                  type="button"
                                  onClick={() => handleLocationSelect(city)}
                                  className="w-full px-4 py-2 text-left hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm"
                                >
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span>{city}</span>
                                </button>
                              ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              No cities found
                            </div>
                          )}
                          {filteredCities.length > 50 && (
                            <div className="px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-200">
                              Showing first 50 results. Type to filter more...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.location?.length > 0
                        ? `${formData.location.length} location(s) selected. Type to add more.`
                        : 'Start typing or select from the list to add locations'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Duration *</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 6 days"
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., ₹22,999"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Old Price</label>
                    <input
                      type="text"
                      name="oldPrice"
                      value={formData.oldPrice}
                      onChange={handleInputChange}
                      placeholder="e.g., ₹24,999"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Seats Left</label>
                    <input
                      type="number"
                      name="seatsLeft"
                      value={formData.seatsLeft}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                      min="0"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty if seats are unlimited</p>
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
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Enquiry form on trip page</label>
                    <select
                      name="enquiryFormType"
                      value={formData.enquiryFormType || 'form1'}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="form1">Form 1 (Name, Email, Phone, Month, Message)</option>
                      <option value="form2">Form 2 (No. of people, Email, Phone, Destination, Month)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Only one form is shown per trip</p>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Main Image</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'image')}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors cursor-pointer flex items-center gap-2 text-sm sm:text-base"
                    >
                      {uploading.image ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                      Upload Image
                    </label>
                    {formData.imageUrl && (
                      <img src={formData.imageUrl} alt="Preview" className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg" />
                    )}
                  </div>
                </div>

                {/* YouTube Video URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube Video URL</label>
                  <input
                    type="text"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/watch?v=VIDEO_ID or just VIDEO_ID"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter YouTube video URL or video ID (e.g., dQw4w9WgXcQ)
                  </p>
                  {formData.videoUrl && extractYouTubeId(formData.videoUrl) && (
                    <div className="mt-2">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYouTubeId(formData.videoUrl)}?rel=0&modestbranding=1`}
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

                {/* Category Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category Tags *</label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryToggle(category)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${formData.category?.includes(category)
                          ? 'bg-[#017233] text-white shadow-md hover:bg-[#015a28]'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  {formData.category?.length === 0 && (
                    <p className="mt-2 text-xs text-red-500">Please select at least one category</p>
                  )}
                </div>

                {/* Subtitle & Intro */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Introduction</label>
                  <textarea
                    name="intro"
                    value={formData.intro}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Why Visit */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Why Visit (Reasons)</label>
                  {formData.whyVisit.map((reason, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={reason}
                        onChange={(e) => handleArrayChange('whyVisit', index, e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('whyVisit', index)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('whyVisit')}
                    className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    + Add Reason
                  </button>
                </div>

                {/* Itinerary */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Itinerary</label>
                  {formData.itinerary.map((day, index) => (
                    <div key={index} className="mb-4 p-4 border-2 border-gray-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                        <input
                          type="text"
                          value={day.day}
                          onChange={(e) => {
                            const newItinerary = [...formData.itinerary];
                            newItinerary[index].day = e.target.value;
                            setFormData(prev => ({ ...prev, itinerary: newItinerary }));
                          }}
                          placeholder="Day 1"
                          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => {
                            const newItinerary = [...formData.itinerary];
                            newItinerary[index].title = e.target.value;
                            setFormData(prev => ({ ...prev, itinerary: newItinerary }));
                          }}
                          placeholder="Title"
                          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('itinerary', index)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        value={day.activities}
                        onChange={(e) => {
                          const newItinerary = [...formData.itinerary];
                          newItinerary[index].activities = e.target.value;
                          setFormData(prev => ({ ...prev, itinerary: newItinerary }));
                        }}
                        placeholder="Optional: additional paragraph description (use Enter for new lines)"
                        rows={4}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y text-sm"
                        style={{ lineHeight: '1.5', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('itinerary', { day: `Day ${formData.itinerary.length + 1}`, title: '', activities: '' })}
                    className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    + Add Day
                  </button>
                </div>

                {/* Included & Not Included */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">What's Included</label>
                    {formData.included.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleArrayChange('included', index, e.target.value)}
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('included', index)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('included')}
                      className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">What's Not Included</label>
                    {formData.notIncluded.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleArrayChange('notIncluded', index, e.target.value)}
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('notIncluded', index)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('notIncluded')}
                      className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Important Notes</label>
                  {formData.notes.map((note, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => handleArrayChange('notes', index, e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('notes', index)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('notes')}
                    className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    + Add Note
                  </button>
                </div>

                {/* FAQ */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">FAQ</label>
                  {formData.faq.map((faq, index) => (
                    <div key={index} className="mb-4 p-4 border-2 border-gray-200 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-600">Question {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('faq', index)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const newFaq = [...formData.faq];
                          newFaq[index].question = e.target.value;
                          setFormData(prev => ({ ...prev, faq: newFaq }));
                        }}
                        placeholder="Question"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => {
                          const newFaq = [...formData.faq];
                          newFaq[index].answer = e.target.value;
                          setFormData(prev => ({ ...prev, faq: newFaq }));
                        }}
                        placeholder="Answer"
                        rows={2}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('faq', { question: '', answer: '' })}
                    className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    + Add FAQ
                  </button>
                </div>

                {/* Hero Images (for Slider) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hero Images (for Slider) <span className="text-gray-500 text-xs">(Recommended: 5 images)</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">These images will be displayed in the hero slider at the top of the trip page</p>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {formData.heroImages && formData.heroImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`Hero ${index + 1}`} className="w-24 h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => {
                            const newHeroImages = formData.heroImages.filter((_, i) => i !== index);
                            const newPublicIds = (formData.heroImagesPublicIds || []).filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, heroImages: newHeroImages, heroImagesPublicIds: newPublicIds }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'heroImages')}
                    className="hidden"
                    id="hero-images-upload"
                  />
                  <label
                    htmlFor="hero-images-upload"
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    {uploading.heroImages ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                    Add Hero Image
                  </label>
                </div>

                {/* Gallery */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gallery Images</label>
                  <p className="text-xs text-gray-500 mb-2">These images will be displayed in the gallery section below the hero slider</p>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {formData.gallery.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`Gallery ${index + 1}`} className="w-24 h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => {
                            const newGallery = formData.gallery.filter((_, i) => i !== index);
                            const newPublicIds = (formData.galleryPublicIds || []).filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, gallery: newGallery, galleryPublicIds: newPublicIds }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleMultipleGalleryUpload(e.target.files);
                        // Reset input so same files can be selected again
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <label
                    htmlFor="gallery-upload"
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    {uploading.gallery ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                    Add Gallery Images (Multiple)
                  </label>
                  <p className="text-xs text-gray-500 mt-1">You can select multiple images at once</p>
                </div>

                {/* Related Trips */}
                <div className="relative" ref={recommendedTripsDropdownRef}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Related Trips</label>

                  {/* Selected Recommended Trips */}
                  {formData.recommendedTrips && formData.recommendedTrips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.recommendedTrips.map((tripId) => {
                        const trip = availableTrips.find(t => t.id === tripId);
                        if (!trip) return null;
                        return (
                          <span
                            key={tripId}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium"
                          >
                            <span>{trip.title}</span>
                            <button
                              type="button"
                              onClick={() => removeRecommendedTrip(tripId)}
                              className="ml-1 text-purple-600 hover:text-purple-800 hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="text"
                      name="recommendedTripsSearch"
                      value={recommendedTripsSearch}
                      onChange={(e) => {
                        setRecommendedTripsSearch(e.target.value);
                        setShowRecommendedTripsDropdown(true);
                      }}
                      onFocus={() => setShowRecommendedTripsDropdown(true)}
                      placeholder="Search and select trips to recommend..."
                      className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

                    {showRecommendedTripsDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {filteredRecommendedTrips.length > 0 ? (
                          filteredRecommendedTrips
                            .filter(trip => !formData.recommendedTrips?.includes(trip.id))
                            .slice(0, 20)
                            .map((trip) => (
                              <button
                                key={trip.id}
                                type="button"
                                onClick={() => handleRecommendedTripSelect(trip.id)}
                                className="w-full px-4 py-3 text-left hover:bg-purple-50 hover:text-purple-600 transition-colors border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-semibold text-sm">{trip.title}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {Array.isArray(trip.location) ? trip.location.join(', ') : trip.location} • {trip.duration}
                                </div>
                              </button>
                            ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No trips found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.recommendedTrips?.length > 0
                      ? `${formData.recommendedTrips.length} trip(s) selected. These will appear at the bottom of the trip detail page.`
                      : 'Search and select trips to recommend to users viewing this trip'
                    }
                  </p>
                </div>

                {/* Related Blogs */}
                <div className="relative" ref={relatedBlogsDropdownRef}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Related Blogs</label>

                  {/* Selected Related Blogs */}
                  {formData.relatedBlogs && formData.relatedBlogs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.relatedBlogs.map((blogId) => {
                        const blog = availableBlogs.find(b => b.id === blogId);
                        if (!blog) return null;
                        return (
                          <span
                            key={blogId}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                          >
                            <span>{blog.title}</span>
                            <button
                              type="button"
                              onClick={() => removeRelatedBlog(blogId)}
                              className="ml-1 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="text"
                      name="relatedBlogsSearch"
                      value={relatedBlogsSearch}
                      onChange={(e) => {
                        setRelatedBlogsSearch(e.target.value);
                        setShowRelatedBlogsDropdown(true);
                      }}
                      onFocus={() => setShowRelatedBlogsDropdown(true)}
                      placeholder="Search and select blogs to relate to this trip..."
                      className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

                    {showRelatedBlogsDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {(() => {
                          console.log('Dropdown opened - availableBlogs:', availableBlogs.length, 'filteredRelatedBlogs:', filteredRelatedBlogs.length);
                          const availableToSelect = filteredRelatedBlogs.filter(blog => !formData.relatedBlogs?.includes(blog.id));
                          console.log('Available blogs to select:', availableToSelect.length);

                          // Show all available blogs if no search
                          const blogsToShow = relatedBlogsSearch ? availableToSelect : filteredRelatedBlogs.filter(blog => !formData.relatedBlogs?.includes(blog.id));

                          if (availableBlogs.length === 0) {
                            return (
                              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No blogs available. Please create blogs first.
                              </div>
                            );
                          }

                          if (blogsToShow.length > 0) {
                            return blogsToShow.slice(0, 20).map((blog) => (
                              <button
                                key={blog.id}
                                type="button"
                                onClick={() => handleRelatedBlogSelect(blog.id)}
                                className="w-full px-4 py-3 text-left hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-semibold text-sm">{blog.title || 'Untitled Blog'}</div>
                                {blog.description && (
                                  <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                    {blog.description}
                                  </div>
                                )}
                              </button>
                            ));
                          }

                          return (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              {relatedBlogsSearch ? 'No blogs found matching your search' : 'All blogs are already selected'}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.relatedBlogs?.length > 0
                      ? `${formData.relatedBlogs.length} blog(s) selected. These will appear in the related blogs section on the trip detail page.`
                      : 'Search and select blogs to relate to this trip'
                    }
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    {editingTrip ? 'Update Trip' : 'Create Trip'}
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

        {/* Trips List */}
        {!showForm && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              {filteredTrips.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No trips found
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredTrips.map((trip) => (
                    <div key={trip.id} className="p-4 hover:bg-gray-50">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          {trip.imageUrl || trip.image ? (
                            <img
                              src={trip.imageUrl || trip.image}
                              alt={trip.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate mb-1">{trip.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {Array.isArray(trip.location) ? trip.location.join(', ') : trip.location}
                          </p>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs text-gray-500">{trip.duration}</span>
                            <span className="text-sm font-semibold text-gray-900">{trip.price}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${trip.status === 'active' ? 'bg-green-100 text-green-800' :
                              trip.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                              {trip.status}
                            </span>
                          </div>
                          {trip.category && trip.category.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {trip.category.map((cat, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/trip/${trip.id}`)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(trip)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(trip.id)}
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

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Image</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Title</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Duration</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Categories</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTrips.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                        No trips found
                      </td>
                    </tr>
                  ) : (
                    filteredTrips.map((trip) => (
                      <tr key={trip.id} className="hover:bg-gray-50">
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          {trip.imageUrl || trip.image ? (
                            <img
                              src={trip.imageUrl || trip.image}
                              alt={trip.title}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">{trip.title}</span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-700 text-sm sm:text-base">
                          {Array.isArray(trip.location) ? trip.location.join(', ') : trip.location}
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-700 text-sm sm:text-base">{trip.duration}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-700 font-semibold text-sm sm:text-base">{trip.price}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          {trip.category && trip.category.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {trip.category.map((cat, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">No categories</span>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${trip.status === 'active' ? 'bg-green-100 text-green-800' :
                            trip.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                            {trip.status}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => navigate(`/trip/${trip.id}`)}
                              className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(trip)}
                              className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(trip.id)}
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

export default AdminTrips;
