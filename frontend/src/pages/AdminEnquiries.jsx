import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, Mail, Phone, Calendar, Users, MessageSquare, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { enquiriesAPI } from '../config/api';
import { useToast } from '../contexts/ToastContext';
import { authAPI } from '../config/api';

const AdminEnquiries = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

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
        fetchEnquiries();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      toast.error('Please login to continue');
      navigate('/login');
    }
  };

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await enquiriesAPI.getAllEnquiries();
      setEnquiries(response.enquiries || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast.error(error.message || 'Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await enquiriesAPI.updateEnquiryStatus(id, newStatus);
      toast.success('Enquiry status updated successfully!');
      fetchEnquiries();
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'booked':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'contacted':
        return <MessageSquare className="w-4 h-4" />;
      case 'booked':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = 
      enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.tripTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.tripLocation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Manage Enquiries
          </h1>
          <p className="text-sm sm:text-base text-gray-600">View and manage trip enquiries from customers</p>
        </div>

        {/* Filters */}
        <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search by name, email, trip..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="booked">Booked</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total</div>
            <div className="text-2xl font-bold text-gray-900">{enquiries.length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {enquiries.filter(e => e.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Contacted</div>
            <div className="text-2xl font-bold text-blue-600">
              {enquiries.filter(e => e.status === 'contacted').length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Booked</div>
            <div className="text-2xl font-bold text-green-600">
              {enquiries.filter(e => e.status === 'booked').length}
            </div>
          </div>
        </div>

        {/* Enquiries List */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            {filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No enquiries found</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredEnquiries.map((enquiry) => (
                  <div 
                    key={enquiry.id} 
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedEnquiry(enquiry)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{enquiry.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(enquiry.status)}`}>
                        {getStatusIcon(enquiry.status)}
                        {enquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{enquiry.tripTitle}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {enquiry.email}
                      </span>
                      {enquiry.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {enquiry.phone}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      {enquiry.selectedMonth && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {enquiry.selectedMonth}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {enquiry.numberOfTravelers} travelers
                      </span>
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
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Trip</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Travelers</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Month</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      No enquiries found
                    </td>
                  </tr>
                ) : (
                  filteredEnquiries.map((enquiry) => (
                    <tr 
                      key={enquiry.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedEnquiry(enquiry)}
                    >
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">{enquiry.name}</span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="text-sm text-gray-900 font-medium">{enquiry.tripTitle}</div>
                        <div className="text-xs text-gray-500">{enquiry.tripLocation}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-700 text-sm sm:text-base">
                        <a href={`mailto:${enquiry.email}`} className="hover:text-blue-600 flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {enquiry.email}
                        </a>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-700 text-sm sm:text-base">
                        {enquiry.phone ? (
                          <a href={`tel:${enquiry.phone}`} className="hover:text-blue-600 flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {enquiry.phone}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-700 text-sm sm:text-base">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {enquiry.numberOfTravelers || 1}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-700 text-sm sm:text-base">
                        {enquiry.selectedMonth || '-'}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(enquiry.status)}`}>
                          {getStatusIcon(enquiry.status)}
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <select
                            value={enquiry.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(enquiry.id, e.target.value);
                            }}
                            className="text-xs px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="booked">Booked</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto my-4">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between z-10 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Enquiry Details</h2>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">Name</label>
                  <p className="text-sm sm:text-base text-gray-900 font-medium">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">Email</label>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-sm sm:text-base text-blue-600 hover:underline flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {selectedEnquiry.email}
                  </a>
                </div>
                {selectedEnquiry.phone && (
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">Phone</label>
                    <a href={`tel:${selectedEnquiry.phone}`} className="text-sm sm:text-base text-blue-600 hover:underline flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                )}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">Status</label>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleStatusUpdate(selectedEnquiry.id, e.target.value)}
                    className={`mt-1 text-xs sm:text-sm px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${getStatusColor(selectedEnquiry.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="booked">Booked</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">Trip</label>
                <p className="text-sm sm:text-base text-gray-900 font-medium">{selectedEnquiry.tripTitle}</p>
                <p className="text-xs sm:text-sm text-gray-600">{selectedEnquiry.tripLocation}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Price: {selectedEnquiry.tripPrice}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedEnquiry.selectedMonth && (
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Selected Month
                    </label>
                    <p className="text-sm sm:text-base text-gray-900">{selectedEnquiry.selectedMonth}</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Number of Travelers
                  </label>
                  <p className="text-sm sm:text-base text-gray-900">{selectedEnquiry.numberOfTravelers || 1}</p>
                </div>
              </div>

              {selectedEnquiry.message && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedEnquiry.message}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm text-gray-500">
                <div>
                  <label className="font-semibold">Created</label>
                  <p>{selectedEnquiry.createdAt ? new Date(selectedEnquiry.createdAt).toLocaleString() : '-'}</p>
                </div>
                <div>
                  <label className="font-semibold">Updated</label>
                  <p>{selectedEnquiry.updatedAt ? new Date(selectedEnquiry.updatedAt).toLocaleString() : '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;





