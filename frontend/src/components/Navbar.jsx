import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';

// Icon Components
const IconAllIndia = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity="0.2"/>
    <circle cx="12" cy="9" r="2.5" stroke="#4ECDC4" fill="#4ECDC4"/>
  </svg>
);

const IconSpiritual = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L4 6v4l8 4 8-4V6l-8-4z" stroke="#F093FB" fill="#F093FB" fillOpacity="0.2"/>
    <path d="M4 14l8 4 8-4" stroke="#F5576C" fill="#F5576C" fillOpacity="0.2"/>
    <path d="M4 10l8 4 8-4" stroke="#FF6B9D" fill="#FF6B9D" fillOpacity="0.2"/>
    <circle cx="12" cy="6" r="1" fill="#F093FB"/>
  </svg>
);

const IconCar = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="17" r="2" stroke="#4FACFE" fill="#4FACFE"/>
    <circle cx="19" cy="17" r="2" stroke="#00F2FE" fill="#00F2FE"/>
    <path d="M17 17H7l-2-5H2l2-6h14l2 6h-3l-2 5z" stroke="#4FACFE" fill="#4FACFE" fillOpacity="0.2"/>
    <path d="M7 10h10" stroke="#00F2FE"/>
  </svg>
);

const IconMountain = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3l4 8 5-5 5 15H2L8 3z" stroke="#A8EDEA" fill="#FED6E3" fillOpacity="0.4"/>
  </svg>
);

const IconBeach = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 18c1.5-1.5 4-3 6-2.5s3.5 2 5.5 1.5c1.5-.5 3-1 4.5-.5s3 1 3 1" stroke="#43E97B"/>
    <path d="M2 15c1.5-1.5 4-3 6-2.5s3.5 2 5.5 1.5c1.5-.5 3-1 4.5-.5s3 1 3 1" stroke="#38F9D7"/>
    <path d="M2 12c1.5-1.5 4-3 6-2.5s3.5 2 5.5 1.5c1.5-.5 3-1 4.5-.5s3 1 3 1" stroke="#43E97B"/>
    <circle cx="12" cy="10" r="1.5" stroke="#38F9D7" fill="#38F9D7"/>
    <circle cx="18" cy="8" r="1.5" stroke="#43E97B" fill="#43E97B"/>
  </svg>
);

const IconWellness = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" stroke="#FA709A" fill="#FEE140" fillOpacity="0.3"/>
    <path d="M12 8v8M8 12h8" stroke="#FA709A"/>
  </svg>
);

const menuItems = [
  { 
    label: 'All India Trips', 
    hasDropdown: true,
    Icon: IconAllIndia
  },
  { 
    label: 'Spiritual Trails', 
    hasDropdown: true,
    Icon: IconSpiritual
  },
  { 
    label: 'Car Booking', 
    hasDropdown: false,
    Icon: IconCar
  },
  { 
    label: 'Himalayan Escapes', 
    hasDropdown: true,
    Icon: IconMountain
  },
  { 
    label: 'Beach & Island Breaks', 
    hasDropdown: false,
    Icon: IconBeach
  },
  { 
    label: 'Wellness Retreats', 
    hasDropdown: false,
    Icon: IconWellness
  }
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const adminDropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAdminDropdownOpen && adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setIsAdminDropdownOpen(false);
      }
    };

    if (isAdminDropdownOpen) {
      // Add event listener after a small delay to avoid immediate closure
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isAdminDropdownOpen]);

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
      // Navigate to search results or filter trips
      // You can customize this based on your routing needs
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="w-full border-b border-gray-100/50 bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:min-h-[80px]">
          <div className="flex items-center justify-between gap-4 lg:justify-start lg:flex-shrink-0">
            <Link to="/" className="flex-shrink-0 group">
              <img
                src="/images/Logo.webp"
                alt="Capture A Trip"
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </Link>
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 rounded-xl text-gray-700 hover:text-[#017233] hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-300" />
              )}
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex w-full flex-1 items-center gap-2 sm:gap-3 rounded-full border border-gray-200/60 bg-white/60 backdrop-blur-sm px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-500 lg:max-w-xl xl:max-w-2xl shadow-sm hover:shadow-md hover:border-[#017233]/30 transition-all duration-300 focus-within:border-[#017233]/50 focus-within:bg-white/80 focus-within:shadow-lg">
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
              type="search"
              placeholder="Search your trip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-none bg-transparent text-xs sm:text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:placeholder:text-gray-300 transition-colors"
            />
          </form>

          <div className="hidden lg:flex flex-wrap items-center justify-end gap-3 text-sm font-semibold text-gray-900 lg:flex-shrink-0">
            <a
              href="tel:+918448801998"
              className="flex items-center gap-2 whitespace-nowrap text-gray-900 transition-all duration-300 hover:text-[#017233] px-3 py-2 rounded-lg hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:shadow-sm"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-gray-900 transition-transform duration-300 hover:rotate-12"
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
                      <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 py-2 z-[100] animate-fade-in">
                        <Link
                          to="/admin/trips"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          🎒 Manage Trips
                        </Link>
                        <Link
                          to="/admin/certificates"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          📜 Manage Certificates
                        </Link>
                        <Link
                          to="/admin/destinations"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          🌍 Manage Destinations
                        </Link>
                        <Link
                          to="/admin/reviews"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          ⭐ Manage Reviews
                        </Link>
                        <Link
                          to="/admin/written-reviews"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          ✍️ Manage Written Reviews
                        </Link>
                        <Link
                          to="/admin/enquiries"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          📧 Manage Enquiries
                        </Link>
                        <Link
                          to="/admin/product-page-settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          ⚙️ Product Page Settings
                        </Link>
                        <Link
                          to="/admin/drivers"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          🚗 Manage Drivers & Car Booking
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-900 transition-all duration-300 hover:text-[#017233] rounded-lg hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:shadow-sm"
                >
                  <User className="w-4 h-4 transition-transform duration-300 hover:scale-110" />
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
              <Link
                to="/login"
                className="rounded-full bg-gradient-to-r from-gray-900 to-black px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 hover:from-gray-800 hover:to-gray-900"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Desktop Menu Items */}
        <div className="hidden lg:flex flex-wrap items-center justify-center gap-x-6 xl:gap-x-8 gap-y-3 text-sm font-semibold text-gray-900 pb-2">
          {menuItems.map((item) => {
            const IconComponent = item.Icon;
            const isCarBooking = item.label === 'Car Booking';
            const isActive = location.pathname === '/car-rentals' && isCarBooking;
            
            // Map menu items to routes
            const getRoute = (label) => {
              switch (label) {
                case 'All India Trips':
                  return '/all-india-trips';
                case 'Spiritual Trails':
                  return '/spiritual-trips';
                case 'Himalayan Escapes':
                  return '/himalayan-escapes';
                case 'Beach & Island Breaks':
                  return '/beach-island-breaks';
                case 'Wellness Retreats':
                  return '/wellness-retreats';
                default:
                  return null;
              }
            };

            const route = getRoute(item.label);
            const isCategoryActive = route && location.pathname === route;
            
            if (isCarBooking) {
              return (
                <Link
                  key={item.label}
                  to="/car-rentals"
                  className={`flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 px-3 py-2 rounded-lg ${
                    isActive 
                      ? 'text-[#017233] bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm' 
                      : 'hover:text-[#017233] hover:bg-gradient-to-br hover:from-green-50/50 hover:to-emerald-50/50'
                  }`}
                >
                  <span className="flex-shrink-0 transition-transform duration-300 hover:scale-110">
                    <IconComponent />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            }
            
            if (route) {
              return (
                <Link
                  key={item.label}
                  to={route}
                  className={`flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 px-3 py-2 rounded-lg ${
                    isCategoryActive 
                      ? 'text-[#017233] bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm' 
                      : 'hover:text-[#017233] hover:bg-gradient-to-br hover:from-green-50/50 hover:to-emerald-50/50'
                  }`}
                >
                  <span className="flex-shrink-0 transition-transform duration-300 hover:scale-110">
                    <IconComponent />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            }
            
            return (
              <button
                key={item.label}
                type="button"
                className="flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 px-3 py-2 rounded-lg hover:text-[#017233] hover:bg-gradient-to-br hover:from-green-50/50 hover:to-emerald-50/50"
              >
                <span className="flex-shrink-0 transition-transform duration-300 hover:scale-110">
                  <IconComponent />
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 pt-4 space-y-4 animate-fade-in bg-white/95 backdrop-blur-sm rounded-b-2xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pb-4 shadow-lg">
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
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        🎒 Manage Trips
                      </Link>
                      <Link
                        to="/admin/certificates"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        📜 Manage Certificates
                      </Link>
                      <Link
                        to="/admin/destinations"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        🌍 Manage Destinations
                      </Link>
                      <Link
                        to="/admin/reviews"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        ⭐ Manage Reviews
                      </Link>
                      <Link
                        to="/admin/written-reviews"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        ✍️ Manage Written Reviews
                      </Link>
                      <Link
                        to="/admin/enquiries"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        📧 Manage Enquiries
                      </Link>
                      <Link
                        to="/admin/product-page-settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        ⚙️ Product Page Settings
                      </Link>
                      <Link
                        to="/admin/drivers"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        🚗 Manage Drivers & Car Booking
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
                  className="rounded-full bg-gradient-to-r from-gray-900 to-black px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Items */}
            <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
              {menuItems.map((item) => {
                const IconComponent = item.Icon;
                const isCarBooking = item.label === 'Car Booking';
                
                // Map menu items to routes
                const getRoute = (label) => {
                  switch (label) {
                    case 'All India Trips':
                      return '/all-india-trips';
                    case 'Spiritual Trails':
                      return '/spiritual-trips';
                    case 'Himalayan Escapes':
                      return '/himalayan-escapes';
                    case 'Beach & Island Breaks':
                      return '/beach-island-breaks';
                    case 'Wellness Retreats':
                      return '/wellness-retreats';
                    default:
                      return null;
                  }
                };

                const route = getRoute(item.label);
                
                if (isCarBooking) {
                  return (
                    <Link
                      key={item.label}
                      to="/car-rentals"
                      className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 transition-colors hover:text-[#017233]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="flex-shrink-0">
                        <IconComponent />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                }
                
                if (route) {
                  return (
                    <Link
                      key={item.label}
                      to={route}
                      className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 transition-colors hover:text-[#017233]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="flex-shrink-0">
                        <IconComponent />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                }
                
                return (
                  <button
                    key={item.label}
                    type="button"
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 transition-colors hover:text-[#017233]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex-shrink-0">
                      <IconComponent />
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
