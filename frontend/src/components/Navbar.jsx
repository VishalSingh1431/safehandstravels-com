import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown, X as XIcon } from 'lucide-react';

// Icon Components
const IconAllIndia = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity="0.2"/>
    <circle cx="12" cy="9" r="2.5" stroke="#4ECDC4" fill="#4ECDC4"/>
  </svg>
);

const IconTravel = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="#4FACFE" fill="#4FACFE" fillOpacity="0.2"/>
    <path d="M6 6h12M6 10h12M6 14h8" stroke="#00F2FE"/>
    <path d="M9 2v4M15 2v4" stroke="#4FACFE"/>
  </svg>
);

const IconExperiences = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#F093FB" fill="#F093FB" fillOpacity="0.2"/>
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#F5576C"/>
  </svg>
);

const IconCustomise = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#43E97B" fill="#43E97B" fillOpacity="0.2"/>
    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#38F9D7"/>
  </svg>
);

const IconWhy = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" stroke="#FA709A" fill="#FEE140" fillOpacity="0.3"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="#FA709A"/>
  </svg>
);

// Travel dropdown items with icons
const travelDropdownItems = [
  { label: 'Spiritual', route: '/spiritual-trips', icon: '🕉️' },
  { label: 'Cultural', route: '/cultural-trips', icon: '🎭' },
  { label: 'Heritage', route: '/heritage-trips', icon: '🏛️' },
  { label: 'Nature', route: '/nature-trips', icon: '🌿' },
  { label: 'Adventure', route: '/adventure-trips', icon: '⛰️' }
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isTravelDropdownOpen, setIsTravelDropdownOpen] = useState(false);
  const adminDropdownRef = useRef(null);
  const travelDropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef(null);

  // Set initial search query from URL if on home page
  useEffect(() => {
    if (location.pathname === '/') {
      const urlParams = new URLSearchParams(location.search);
      const urlSearch = urlParams.get('search');
      if (urlSearch) {
        setSearchQuery(urlSearch);
      }
    }
  }, [location]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    const handleAuthChange = () => checkAuthStatus();
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // Scroll behavior for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut for search (Press / to focus)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAdminDropdownOpen && adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setIsAdminDropdownOpen(false);
      }
      if (isTravelDropdownOpen && travelDropdownRef.current && !travelDropdownRef.current.contains(event.target)) {
        setIsTravelDropdownOpen(false);
      }
    };

    if (isAdminDropdownOpen || isTravelDropdownOpen) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isAdminDropdownOpen, isTravelDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsMobileMenuOpen(false);
    window.dispatchEvent(new Event('authChange'));
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <>
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <nav className={`w-full border-b border-gray-100/50 bg-white sticky top-0 z-50 transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}>
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:min-h-[80px]">
          <div className="flex items-center justify-between gap-4 lg:justify-start lg:flex-shrink-0">
            <Link to="/" className="flex-shrink-0 group">
              <img
                src="/images/Logo.webp"
                alt="Capture A Trip"
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </Link>
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 rounded-xl text-gray-700 hover:text-[#017233] hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-300" />
              )}
            </button>
          </div>

          <form onSubmit={handleSearch} className="relative flex w-full flex-1 items-center gap-2 sm:gap-3 rounded-full border border-gray-200/60 bg-white/60 backdrop-blur-sm px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-500 lg:max-w-xl xl:max-w-2xl shadow-sm hover:shadow-md hover:border-[#017233]/30 transition-all duration-300 focus-within:border-[#017233]/50 focus-within:bg-white/80 focus-within:shadow-lg hover:scale-[1.02] group">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0 transition-colors duration-300 group-focus-within:text-[#017233]"
              aria-hidden="true"
            >
              <path
                d="M15.5 14h-.79l-.28-.27a6 6 0 1 0-.71.71l.27.28v.79L20 21.5 21.5 20l-5.5-6zM10 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
                fill="currentColor"
              />
            </svg>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search your trip... (Press /)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-none bg-transparent text-xs sm:text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:placeholder:text-gray-300 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 p-1 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Clear search"
              >
                <XIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </form>

          <div className="hidden lg:flex flex-wrap items-center justify-end gap-3 text-sm font-semibold text-gray-900 lg:flex-shrink-0">
            <a
              href="tel:+918448801998"
              className="flex items-center gap-2 whitespace-nowrap text-gray-900 transition-all duration-300 hover:text-[#017233] px-3 py-2 rounded-lg hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:shadow-sm hover:scale-105 active:scale-95"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-gray-900 transition-transform duration-300 hover:rotate-12 hover:scale-110"
                aria-hidden="true"
              >
                <path
                  d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 .97-.26 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1v3.61a1 1 0 0 1-1 1A16 16 0 0 1 3 5a1 1 0 0 1 1-1h3.61a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.26.97z"
                  fill="currentColor"
                />
              </svg>
              <span>(+91) 8448801998</span>
            </a>
            {isLoggedIn ? (
              <>
                {(user?.role === 'admin' || user?.role === 'main_admin') && (
                  <div className="relative" ref={adminDropdownRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAdminDropdownOpen(!isAdminDropdownOpen);
                      }}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-[#017233] bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-[#017233]/20 hover:border-[#017233]/40 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                    >
                      Admin Panel
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isAdminDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isAdminDropdownOpen && (
                      <div className="absolute right-0 mt-2 min-w-fit w-auto bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 py-2 z-[100] animate-fade-in">
                        <Link
                          to="/admin/trips"
                          className="flex items-center gap-3 whitespace-nowrap px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105 active:scale-95"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <span className="text-base flex-shrink-0">🎒</span>
                          <span>Manage Trips</span>
                        </Link>
                        <Link
                          to="/admin/certificates"
                          className="flex items-center gap-3 whitespace-nowrap px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105 active:scale-95"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <span className="text-base flex-shrink-0">📜</span>
                          <span>Manage Certificates</span>
                        </Link>
                        <Link
                          to="/admin/destinations"
                          className="flex items-center gap-3 whitespace-nowrap px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105 active:scale-95"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <span className="text-base flex-shrink-0">🌍</span>
                          <span>Manage Destinations</span>
                        </Link>
                        <Link
                          to="/admin/enquiries"
                          className="flex items-center gap-3 whitespace-nowrap px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105 active:scale-95"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <span className="text-base flex-shrink-0">📧</span>
                          <span>Manage Enquiries</span>
                        </Link>
                        <Link
                          to="/admin/drivers"
                          className="flex items-center gap-3 whitespace-nowrap px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105 active:scale-95"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <span className="text-base flex-shrink-0">🚗</span>
                          <span>Manage Drivers & Car Booking</span>
                        </Link>
                        <Link
                          to="/admin/popular-trips"
                          className="flex items-center gap-3 whitespace-nowrap px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105 active:scale-95"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <span className="text-base flex-shrink-0">⭐</span>
                          <span>Manage Popular Trips</span>
                        </Link>
                        <Link
                          to="/admin/vibe-videos"
                          className="flex items-center gap-3 whitespace-nowrap px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105 active:scale-95"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <span className="text-base flex-shrink-0">🎬</span>
                          <span>Manage Vibe Videos</span>
                        </Link>
                        <Link
                          to="/admin/traveller-reviews"
                          className="flex items-center gap-3 whitespace-nowrap px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105 active:scale-95"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <span className="text-base flex-shrink-0">⭐</span>
                          <span>Manage Traveller Reviews</span>
                        </Link>
                        <Link
                          to="/admin/faqs"
                          className="flex items-center gap-3 whitespace-nowrap px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105 active:scale-95"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <span className="text-base flex-shrink-0">❓</span>
                          <span>Manage FAQs</span>
                        </Link>
                        <Link
                          to="/admin/banners"
                          className="flex items-center gap-3 whitespace-nowrap px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105 active:scale-95"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <span className="text-base flex-shrink-0">🖼️</span>
                          <span>Manage Banners</span>
                        </Link>
                        <Link
                          to="/admin/branding-partners"
                          className="flex items-center gap-3 whitespace-nowrap px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105 active:scale-95"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <span className="text-base flex-shrink-0">🤝</span>
                          <span>Manage Branding Partners</span>
                        </Link>
                        <Link
                          to="/admin/hotel-partners"
                          className="flex items-center gap-3 whitespace-nowrap px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2 hover:scale-105 active:scale-95"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <span className="text-base flex-shrink-0">🏨</span>
                          <span>Manage Hotel Partners</span>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-900 transition-all duration-300 hover:text-[#017233] rounded-lg hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:shadow-sm hover:scale-105 active:scale-95"
                >
                  <User className="w-4 h-4 transition-transform duration-300 hover:scale-125" />
                  <span>{user?.name || user?.email || 'User'}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-gradient-to-r from-gray-900 to-black px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 hover:from-gray-800 hover:to-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full bg-gradient-to-r from-[#017233] to-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 hover:from-[#015a28] hover:to-[#017233] shadow-md"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Desktop Menu Items */}
        <div className="hidden lg:flex flex-wrap items-center justify-center gap-x-4 xl:gap-x-6 gap-y-3 text-sm font-semibold text-gray-900 pb-3 border-t border-gray-100/50 pt-3">
          {/* All India Tours */}
          <Link
            to="/all-india-trips"
            className={`relative flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 px-4 py-2.5 rounded-lg hover:scale-110 active:scale-95 ${
              location.pathname === '/all-india-trips'
                ? 'text-[#017233] bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm'
                : 'hover:text-[#017233] hover:bg-gradient-to-br hover:from-green-50/50 hover:to-emerald-50/50'
            }`}
          >
            <span className="transition-transform duration-300 hover:scale-125">
              <IconAllIndia />
            </span>
            <span>All India Tours</span>
            {location.pathname === '/all-india-trips' && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#017233] rounded-full" />
            )}
          </Link>

          {/* Travel Dropdown */}
          <div 
            className="relative" 
            ref={travelDropdownRef}
            onMouseEnter={() => setIsTravelDropdownOpen(true)}
            onMouseLeave={() => setIsTravelDropdownOpen(false)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsTravelDropdownOpen(!isTravelDropdownOpen);
              }}
              className={`relative flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 px-4 py-2.5 rounded-lg hover:scale-110 active:scale-95 ${
                travelDropdownItems.some(item => location.pathname === item.route)
                  ? 'text-[#017233] bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm'
                  : 'hover:text-[#017233] hover:bg-gradient-to-br hover:from-green-50/50 hover:to-emerald-50/50'
              }`}
            >
              <span className="transition-transform duration-300 hover:scale-125">
                <IconTravel />
              </span>
              <span>Travel</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 hover:scale-110 ${isTravelDropdownOpen ? 'rotate-180' : ''}`} />
              {travelDropdownItems.some(item => location.pathname === item.route) && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#017233] rounded-full" />
              )}
            </button>
            {isTravelDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 p-3 z-[100] animate-fade-in overflow-hidden">
                <div className="grid grid-cols-2 gap-2">
                  {travelDropdownItems.map((item, index) => (
                    <Link
                      key={item.label}
                      to={item.route}
                      className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 group hover:scale-105 active:scale-95 ${
                        location.pathname === item.route
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-[#017233]/30 shadow-md'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-transparent hover:border-[#017233]/20 hover:bg-gradient-to-br hover:from-green-50/50 hover:to-emerald-50/50 hover:shadow-md'
                      }`}
                      onClick={() => setIsTravelDropdownOpen(false)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="text-3xl transition-transform duration-200 group-hover:scale-125 group-hover:rotate-6">{item.icon}</span>
                      <span className={`text-sm font-semibold transition-colors ${
                        location.pathname === item.route
                          ? 'text-[#017233]'
                          : 'text-gray-700 group-hover:text-[#017233]'
                      }`}>
                        {item.label}
                      </span>
                      {location.pathname === item.route && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#017233] rounded-full" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Experiences */}
          <Link
            to="/experiences"
            className={`relative flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 px-4 py-2.5 rounded-lg hover:scale-110 active:scale-95 ${
              location.pathname === '/experiences'
                ? 'text-[#017233] bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm'
                : 'hover:text-[#017233] hover:bg-gradient-to-br hover:from-green-50/50 hover:to-emerald-50/50'
            }`}
          >
            <span className="transition-transform duration-300 hover:scale-125">
              <IconExperiences />
            </span>
            <span>Experiences</span>
            {location.pathname === '/experiences' && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#017233] rounded-full" />
            )}
          </Link>

          {/* Customise your Trip */}
          <Link
            to="/customise-trip"
            className={`relative flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 px-4 py-2.5 rounded-lg hover:scale-110 active:scale-95 ${
              location.pathname === '/customise-trip'
                ? 'text-[#017233] bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm'
                : 'hover:text-[#017233] hover:bg-gradient-to-br hover:from-green-50/50 hover:to-emerald-50/50'
            }`}
          >
            <span className="transition-transform duration-300 hover:scale-125">
              <IconCustomise />
            </span>
            <span>Customise your Trip</span>
            {location.pathname === '/customise-trip' && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#017233] rounded-full" />
            )}
          </Link>

          {/* Why SafeHands Travels */}
          <Link
            to="/why-safehands-travels"
            className={`relative flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 px-4 py-2.5 rounded-lg hover:scale-110 active:scale-95 ${
              location.pathname === '/why-safehands-travels'
                ? 'text-[#017233] bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm'
                : 'hover:text-[#017233] hover:bg-gradient-to-br hover:from-green-50/50 hover:to-emerald-50/50'
            }`}
          >
            <span className="transition-transform duration-300 hover:scale-125">
              <IconWhy />
            </span>
            <span>Why SafeHands Travels</span>
            {location.pathname === '/why-safehands-travels' && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#017233] rounded-full" />
            )}
          </Link>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 pt-4 space-y-4 bg-white/95 backdrop-blur-sm rounded-b-2xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pb-4 shadow-lg animate-slide-down">
            {/* Mobile Phone & Login */}
            <div className="flex flex-col gap-3">
              <a
                href="tel:+918448801998"
                className="flex items-center gap-2 text-sm font-semibold text-gray-900 transition-colors hover:text-[#017233]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-gray-900"
                  aria-hidden="true"
                >
                  <path
                    d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 .97-.26 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1v3.61a1 1 0 0 1-1 1A16 16 0 0 1 3 5a1 1 0 0 1 1-1h3.61a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.26.97z"
                    fill="currentColor"
                  />
                </svg>
                <span>(+91) 8448801998</span>
              </a>
              {isLoggedIn ? (
                <>
                  {(user?.role === 'admin' || user?.role === 'main_admin') && (
                    <div className="mb-2 space-y-1">
                      <div className="px-4 py-2 text-sm font-semibold text-[#017233] bg-gradient-to-br from-green-50 to-emerald-50 border border-[#017233]/20 rounded-xl">
                        Admin Panel
                      </div>
                      <Link
                        to="/admin/trips"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        🎒 Manage Trips
                      </Link>
                      <Link
                        to="/admin/certificates"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        📜 Manage Certificates
                      </Link>
                      <Link
                        to="/admin/destinations"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        🌍 Manage Destinations
                      </Link>
                      <Link
                        to="/admin/enquiries"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        📧 Manage Enquiries
                      </Link>
                      <Link
                        to="/admin/drivers"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        🚗 Manage Drivers & Car Booking
                      </Link>
                      <Link
                        to="/admin/popular-trips"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        ⭐ Manage Popular Trips
                      </Link>
                      <Link
                        to="/admin/vibe-videos"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        🎬 Manage Vibe Videos
                      </Link>
                      <Link
                        to="/admin/traveller-reviews"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        ⭐ Manage Traveller Reviews
                      </Link>
                      <Link
                        to="/admin/faqs"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        ❓ Manage FAQs
                      </Link>
                      <Link
                        to="/admin/banners"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        🖼️ Manage Banners
                      </Link>
                      <Link
                        to="/admin/branding-partners"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        🤝 Manage Branding Partners
                      </Link>
                      <Link
                        to="/admin/hotel-partners"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        🏨 Manage Hotel Partners
                      </Link>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:text-[#017233]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>{user?.name || user?.email || 'User'}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full mt-2 rounded-full bg-gradient-to-r from-gray-900 to-black px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 text-center"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full bg-gradient-to-r from-[#017233] to-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 text-center shadow-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Items */}
            <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
              {/* All India Tours */}
              <Link
                to="/all-india-trips"
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 transition-all duration-300 hover:text-[#017233] hover:scale-105 active:scale-95"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IconAllIndia />
                <span>All India Tours</span>
              </Link>

              {/* Travel Dropdown */}
              <div>
                <button
                  onClick={() => setIsTravelDropdownOpen(!isTravelDropdownOpen)}
                  className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 transition-colors hover:text-[#017233]"
                >
                  <div className="flex items-center gap-1.5">
                    <IconTravel />
                    <span>Travel</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isTravelDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isTravelDropdownOpen && (
                  <div className="ml-4 mt-3 grid grid-cols-2 gap-2 animate-slide-down">
                    {travelDropdownItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.route}
                        className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-200 group hover:scale-105 active:scale-95 ${
                          location.pathname === item.route
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-[#017233]/30 shadow-md'
                            : 'bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-transparent hover:border-[#017233]/20 hover:bg-gradient-to-br hover:from-green-50/50 hover:to-emerald-50/50 hover:shadow-md'
                        }`}
                        onClick={() => {
                          setIsTravelDropdownOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <span className="text-2xl transition-transform duration-200 group-hover:scale-125 group-hover:rotate-6">{item.icon}</span>
                        <span className={`text-xs font-semibold transition-colors ${
                          location.pathname === item.route
                            ? 'text-[#017233]'
                            : 'text-gray-700 group-hover:text-[#017233]'
                        }`}>
                          {item.label}
                        </span>
                        {location.pathname === item.route && (
                          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#017233] rounded-full" />
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Experiences */}
              <Link
                to="/experiences"
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 transition-all duration-300 hover:text-[#017233] hover:scale-105 active:scale-95"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IconExperiences />
                <span>Experiences</span>
              </Link>

              {/* Customise your Trip */}
              <Link
                to="/customise-trip"
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 transition-all duration-300 hover:text-[#017233] hover:scale-105 active:scale-95"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IconCustomise />
                <span>Customise your Trip</span>
              </Link>

              {/* Why SafeHands Travels */}
              <Link
                to="/why-safehands-travels"
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 transition-all duration-300 hover:text-[#017233] hover:scale-105 active:scale-95"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IconWhy />
                <span>Why SafeHands Travels</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navbar;
