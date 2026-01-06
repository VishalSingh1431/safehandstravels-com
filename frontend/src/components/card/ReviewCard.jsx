function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  // Ensure video URL is properly formatted
  const videoUrl = review.videoUrl || review.video_url;
  
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
      {/* Video Section */}
      {videoUrl ? (
        <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
          <video
            controls
            className="w-full h-full object-cover"
            preload="metadata"
            playsInline
            onError={(e) => {
              console.error('Video load error:', videoUrl, e);
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-purple-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10 pointer-events-none">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
            <span className="hidden sm:inline">Video Review</span>
            <span className="sm:hidden">Video</span>
          </div>
        </div>
      ) : (
        <div className="relative w-full aspect-video bg-gray-200 flex items-center justify-center">
          <p className="text-xs sm:text-sm text-gray-500">No video available</p>
        </div>
      )}
      
      {/* Card Content */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={review.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(review.name) + '&background=017233&color=fff&size=128'}
              alt={review.name}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-3 border-white shadow-lg group-hover:scale-110 transition-transform ring-2 ring-gray-100"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] border-2 border-white flex items-center justify-center shadow-md">
              <span className="text-white text-[10px] sm:text-xs font-bold">✓</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{review.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{review.location || 'Traveler'}</p>
          </div>
        </div>
        
        <div className="mb-3 sm:mb-4">
          <StarRating rating={review.rating} />
        </div>
        
        {review.review && (
          <p className="text-gray-700 leading-relaxed text-xs sm:text-sm line-clamp-3">{review.review}</p>
        )}
      </div>
    </div>
  )
}

export default ReviewCard

