import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, Star, StarOff, Plus, X, Save, Tag } from 'lucide-react';
import { tripsAPI, locationFiltersAPI } from '../config/api';
import { useToast } from '../contexts/ToastContext';
import { authAPI } from '../config/api';

const AdminPopularTrips = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState({});
  const [filters, setFilters] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [savingFilters, setSavingFilters] = useState(false);
  const [newFilter, setNewFilter] = useState('');
  const [showFiltersSection, setShowFiltersSection] = useState(false);

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
        fetchTrips();
        fetchFilters();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      toast.error('Please login to continue');
      navigate('/login');
    }
  };

  const fetchFilters = async () => {
    try {
      setLoadingFilters(true);
      const response = await locationFiltersAPI.getLocationFiltersAdmin();
      setFilters(response.filters || []);
    } catch (error) {
      console.error('Error fetching filters:', error);
      toast.error(error.message || 'Failed to load location filters');
    } finally {
      setLoadingFilters(false);
    }
  };

  const handleAddFilter = () => {
    if (!newFilter.trim()) {
      toast.error('Please enter a filter name');
      return;
    }
    if (filters.includes(newFilter.trim())) {
      toast.error('This filter already exists');
      return;
    }
    if (newFilter.trim() === 'All') {
      toast.error("'All' filter is always included and cannot be added");
      return;
    }
    setFilters([...filters, newFilter.trim()]);
    setNewFilter('');
  };

  const handleRemoveFilter = (filterToRemove) => {
    if (filterToRemove === 'All') {
      toast.error("'All' filter cannot be removed");
      return;
    }
    setFilters(filters.filter(f => f !== filterToRemove));
  };

  const handleSaveFilters = async () => {
    try {
      setSavingFilters(true);
      await locationFiltersAPI.updateLocationFilters(filters);
      toast.success('Location filters updated successfully');
    } catch (error) {
      console.error('Error saving filters:', error);
      toast.error(error.message || 'Failed to save location filters');
    } finally {
      setSavingFilters(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddFilter();
    }
  };

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await tripsAPI.getAllTripsAdmin();
      // Show only active trips
      const activeTrips = (response.trips || []).filter(trip => trip.status === 'active');
      setTrips(activeTrips);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast.error(error.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const togglePopular = async (tripId, currentStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [tripId]: true }));
      
      const trip = trips.find(t => t.id === tripId);
      if (!trip) return;

      const updatedTrip = await tripsAPI.updateTrip(tripId, {
        ...trip,
        isPopular: !currentStatus
      });

      setTrips(prev => prev.map(t => t.id === tripId ? updatedTrip : t));
      toast.success(`Trip ${!currentStatus ? 'added to' : 'removed from'} popular trips`);
    } catch (error) {
      console.error('Error updating trip:', error);
      toast.error(error.message || 'Failed to update trip');
    } finally {
      setUpdating(prev => ({ ...prev, [tripId]: false }));
    }
  };

  const filteredTrips = trips.filter(trip =>
    trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularTrips = filteredTrips.filter(trip => trip.isPopular);
  const otherTrips = filteredTrips.filter(trip => !trip.isPopular);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              ⭐
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Manage Popular Trips
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl">
            Select which trips should appear in the "Popular Trips" section on the homepage.
            Only trips marked as popular will be displayed to users.
          </p>
        </div>

        {/* Location Filters Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Tag className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Location Filters</h2>
              </div>
              <button
                onClick={() => setShowFiltersSection(!showFiltersSection)}
                className="text-sm text-[#017233] hover:underline font-medium"
              >
                {showFiltersSection ? 'Hide' : 'Manage Filters'}
              </button>
            </div>
            
            {showFiltersSection && (
              <>
                {/* Add New Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Add New Location Filter
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFilter}
                      onChange={(e) => setNewFilter(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter location name (e.g., Goa, Manali)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-transparent"
                    />
                    <button
                      onClick={handleAddFilter}
                      className="px-4 py-2 bg-[#017233] text-white rounded-lg hover:bg-[#015a28] transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Filters List */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Filters ({filters.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {filters.map((filter, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-all ${
                          filter === 'All'
                            ? 'bg-gradient-to-br from-[#017233] to-[#01994d] text-white border-[#017233]'
                            : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <span className="font-medium">{filter}</span>
                        {filter !== 'All' && (
                          <button
                            onClick={() => handleRemoveFilter(filter)}
                            className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                            title="Remove filter"
                          >
                            <X className="w-3 h-3 text-red-600" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> The "All" filter is always included and cannot be removed.
                  </p>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveFilters}
                    disabled={savingFilters}
                    className="px-4 py-2 bg-gradient-to-r from-[#017233] to-[#01994d] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {savingFilters ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Filters
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search trips by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#017233] focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-[#017233]" />
          </div>
        ) : (
          <>
            {/* Popular Trips Section */}
            {popularTrips.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Popular Trips ({popularTrips.length})
                  </h2>
                </div>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {popularTrips.map((trip) => (
                      <div
                        key={trip.id}
                        className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <img
                            src={trip.imageUrl || trip.image || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=60'}
                            alt={trip.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{trip.title}</h3>
                            <p className="text-sm text-gray-600">{trip.location}</p>
                            <p className="text-sm font-medium text-[#017233] mt-1">{trip.price}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => togglePopular(trip.id, trip.isPopular)}
                          disabled={updating[trip.id]}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updating[trip.id] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Star className="w-4 h-4 fill-yellow-500" />
                              <span className="font-medium">Popular</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other Trips Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <StarOff className="w-6 h-6 text-gray-400" />
                <h2 className="text-2xl font-bold text-gray-900">
                  All Trips ({otherTrips.length})
                </h2>
              </div>
              {otherTrips.length > 0 ? (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {otherTrips.map((trip) => (
                      <div
                        key={trip.id}
                        className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <img
                            src={trip.imageUrl || trip.image || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=60'}
                            alt={trip.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{trip.title}</h3>
                            <p className="text-sm text-gray-600">{trip.location}</p>
                            <p className="text-sm font-medium text-[#017233] mt-1">{trip.price}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => togglePopular(trip.id, trip.isPopular)}
                          disabled={updating[trip.id]}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updating[trip.id] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <StarOff className="w-4 h-4" />
                              <span className="font-medium">Add to Popular</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? 'No trips found matching your search.' : 'No trips available.'}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPopularTrips;

