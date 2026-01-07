import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

function VideoCard({ video, isTall = false, index = 0, shouldPreload = false }) {
  const [isMuted, setIsMuted] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const iframeRef = useRef(null)
  const containerRef = useRef(null)

  // Extract YouTube video ID from URL or use direct ID
  const getYouTubeId = (urlOrId) => {
    if (!urlOrId) return null;
    
    // If it's already just an ID, return it
    if (!urlOrId.includes('youtube.com') && !urlOrId.includes('youtu.be')) {
      return urlOrId.length === 11 ? urlOrId : null;
    }
    
    // Extract ID from YouTube URL (including Shorts)
    // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID
    const regExp = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^#&?\/\s]{11})/;
    const match = urlOrId.match(regExp);
    return (match && match[1] && match[1].length === 11) ? match[1] : null;
  };

  const youtubeId = getYouTubeId(video.youtubeId || video.youtubeUrl);
  const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null;
  
  // Intersection Observer for lazy loading and autoplay
  useEffect(() => {
    if (!containerRef.current || !youtubeId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          const intersectionRatio = entry.intersectionRatio;
          
          // Video is visible (at least 50% visible) - load and play
          if (isIntersecting && intersectionRatio >= 0.5) {
            setShouldLoad(true);
            setIsVisible(true);
          } 
          // Video is approaching viewport (preload for smooth experience)
          else if (isIntersecting && intersectionRatio > 0 && intersectionRatio < 0.5) {
            if (shouldPreload) {
              setShouldLoad(true); // Preload but don't autoplay yet
            }
            setIsVisible(false);
          }
          // Video is not visible - pause
          else {
            setIsVisible(false);
          }
        });
      },
      {
        root: null,
        rootMargin: '150px', // Preload when 150px away from viewport
        threshold: [0, 0.1, 0.5, 0.8, 1] // Multiple thresholds for better control
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [youtubeId, shouldPreload]);

  // Build embed URL dynamically based on current state
  const embedUrl = (shouldLoad && youtubeId) 
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=${isVisible ? 1 : 0}&mute=${isMuted ? 1 : 0}&loop=1&playlist=${youtubeId}&playsinline=1&controls=0`
    : null;

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  }

  // Calculate dimensions based on video aspect ratio
  // YouTube Shorts are 9:16 (vertical), regular videos are 16:9 (horizontal)
  // For vertical videos: narrower width to fit perfectly
  // For horizontal videos: wider width
  
  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-2xl shadow-lg border-2 border-gray-200/50 overflow-hidden hover:border-[#017233]/50 hover:shadow-[0_20px_50px_rgba(1,114,51,0.3)] transition-all duration-300 group m-0 p-0"
    >
      <div 
        className="relative overflow-hidden rounded-2xl"
        style={{
          width: isTall ? '280px' : '450px', // Narrower for vertical videos (Shorts), wider for horizontal
          height: isTall ? '500px' : '253px', // Taller for vertical videos, maintains 16:9 for horizontal
        }}
      >
        {shouldLoad && embedUrl ? (
          <>
            <iframe
              ref={iframeRef}
              src={embedUrl}
              className="w-full h-full object-cover"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`YouTube video ${index + 1}`}
              loading="lazy"
            />
            {/* Mute/Unmute Button - Only show when video is loaded */}
            {shouldLoad && (
              <button
                onClick={toggleMute}
                className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-all duration-300 hover:scale-110 z-10"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            )}
          </>
        ) : thumbnailUrl ? (
          // Show thumbnail until video should be loaded
          <div className="w-full h-full relative">
            <img
              src={thumbnailUrl}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Loading indicator */}
            {shouldPreload && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500 text-sm">No video available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCard

