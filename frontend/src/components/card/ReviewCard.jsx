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
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg p-6 md:p-8 border border-blue-100 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg group-hover:scale-110 transition-transform"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] border-2 border-white flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">{review.name}</h3>
          <p className="text-sm text-gray-500">{review.location}</p>
        </div>
      </div>
      <div className="mb-4">
        <StarRating rating={review.rating} />
      </div>
      <p className="text-gray-700 leading-relaxed text-base">{review.review}</p>
    </div>
  )
}

export default ReviewCard

