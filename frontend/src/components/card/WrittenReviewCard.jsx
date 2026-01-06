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

function WrittenReviewCard({ review }) {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border-2 border-teal-100/50 hover:border-[#017233]/50 hover:shadow-[0_20px_50px_rgba(1,114,51,0.3)] transition-all duration-300 group">
      {/* Header Section */}
      <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
        <div className="relative flex-shrink-0">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-lg group-hover:scale-110 transition-transform"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] border-2 border-white flex items-center justify-center shadow-md">
            <span className="text-white text-[10px] sm:text-xs font-bold">✓</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2 sm:gap-0">
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{review.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{review.location}</p>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap self-start sm:self-auto">{review.date}</span>
          </div>
          <div className="mb-2 sm:mb-3">
            <StarRating rating={review.rating} />
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-base sm:text-lg group-hover:text-[#017233] transition-colors">{review.title}</h4>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{review.review}</p>
      </div>
    </div>
  )
}

export default WrittenReviewCard

