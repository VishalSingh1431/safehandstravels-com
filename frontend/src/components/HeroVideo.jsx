import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function HeroVideo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  // Keep search input in sync with URL (clear when search param is removed)
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    setSearchQuery(urlSearch ?? '');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === '') {
      navigate('/', { replace: true });
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-gray-900 via-gray-800 to-black relative overflow-hidden">
      <div className="w-full px-0 pb-10 pt-0 relative">
        <div className="w-full relative">
          {/* Video with overlay gradient */}
          <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] w-full">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              poster="https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=1600&q=60"
            >
              <source src="/video/Slider.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Enhanced gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
          </div>
          
          {/* Enhanced Search Bar Overlay with better positioning */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-3 sm:px-4 md:px-6 z-10 animate-fade-in">
            <form 
              onSubmit={handleSearch} 
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 shadow-2xl transition-all duration-300 hover:bg-white/15 hover:border-[#017233]/50 hover:shadow-[0_20px_50px_rgba(1,114,51,0.3)] focus-within:bg-white/20 focus-within:border-[#017233] focus-within:shadow-[0_20px_50px_rgba(1,114,51,0.4)]"
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-white/80 flex-shrink-0 transition-colors duration-300 group-focus-within:text-[#017233]"
                  aria-hidden="true"
                >
                  <path
                    d="M15.5 14h-.79l-.28-.27a6 6 0 1 0-.71.71l.27.28v.79L20 21.5 21.5 20l-5.5-6zM10 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
                    fill="currentColor"
                  />
                </svg>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Search your trip destination..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="w-full border-none bg-transparent text-sm sm:text-base text-white outline-none placeholder:text-white/60 focus:placeholder:text-white/40 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-[#017233] to-[#01994d] px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:from-[#01994d] hover:to-[#01b35a] hover:shadow-lg hover:shadow-[#017233]/50 hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroVideo

