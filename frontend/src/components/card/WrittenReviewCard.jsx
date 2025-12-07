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
    <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl shadow-lg p-6 md:p-8 border border-teal-100 hover:shadow-xl transition-all duration-300 group">
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-5">
        <div className="relative">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg group-hover:scale-110 transition-transform"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] border-2 border-white flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{review.name}</h3>
              <p className="text-sm text-gray-600 font-medium">{review.location}</p>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">{review.date}</span>
          </div>
          <div className="mb-3">
            <StarRating rating={review.rating} />
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-[#017233] transition-colors">{review.title}</h4>
        <p className="text-gray-700 leading-relaxed text-base">{review.review}</p>
      </div>
    </div>
  )
}

export default WrittenReviewCard

