function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5 sm:gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
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

function WrittenReviewCard({ review }) {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 border-2 border-teal-100/50 hover:border-[#017233]/50 hover:shadow-[0_20px_50px_rgba(1,114,51,0.3)] transition-all duration-300 group h-[280px] sm:h-[300px] md:h-[320px] w-full flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3 flex-shrink-0">
        <div className="relative flex-shrink-0">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-lg group-hover:scale-110 transition-transform"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] border-2 border-white flex items-center justify-center shadow-md">
            <span className="text-white text-[8px] sm:text-[10px] font-bold">✓</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1.5 gap-1 sm:gap-0">
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{review.name}</h3>
              <p className="text-[10px] sm:text-xs text-gray-600 font-medium truncate">{review.location}</p>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap self-start sm:self-auto">{review.date}</span>
          </div>
          <div className="mb-1.5 sm:mb-2">
            <StarRating rating={review.rating} />
          </div>
        </div>
      </div>

      {/* Review Content - Scrollable */}
      <div className="bg-white/60 backdrop-blur-sm rounded-md sm:rounded-lg p-2 sm:p-3 border border-gray-100 flex-1 flex flex-col overflow-hidden min-h-0">
        <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base group-hover:text-[#017233] transition-colors truncate flex-shrink-0">{review.title}</h4>
        <div className="overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">{review.review}</p>
        </div>
      </div>
    </div>
  )
}

export default WrittenReviewCard

