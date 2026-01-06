import { useState } from 'react'
import { Play } from 'lucide-react'

function VideoCard({ video, isTall = false }) {
  const [isPlaying, setIsPlaying] = useState(false)

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
  const embedUrl = youtubeId ? `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=1&playsinline=1` : null;

  const handleClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200/50 overflow-hidden hover:border-[#017233]/50 hover:shadow-[0_20px_50px_rgba(1,114,51,0.3)] transition-all duration-300 group h-full">
      <div className={`relative overflow-hidden rounded-t-2xl ${isTall ? 'h-96 md:h-[500px]' : 'h-48 md:h-56'}`}>
        {isPlaying && embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full object-cover"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
          />
        ) : thumbnailUrl ? (
          <>
            <img
              src={thumbnailUrl}
              alt="Video thumbnail"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Play Button Overlay */}
            <div 
              className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer"
              onClick={handleClick}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#017233]/90 group-hover:bg-[#017233] flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
              </div>
            </div>
          </>
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

