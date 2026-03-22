import { useNavigate } from 'react-router-dom'
import { getThumbnailUrl } from '../../utils/imageOptimizer'
import { getLocationString, triggerEnquiryForm } from '../../utils/tripUtils'

function TripCard({ trip }) {
  const navigate = useNavigate()

  // Optimize image URL for thumbnail (smaller size, faster loading)
  const imageUrl = trip.imageUrl || trip.image || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=60'
  const optimizedImageUrl = getThumbnailUrl(imageUrl)

  const handleCardClick = () => {
    navigate(`/trip/${trip.id}`)
  }

  const handleEnquireClick = (e) => {
    e.stopPropagation()
    triggerEnquiryForm()
  }

  const handleViewClick = (e) => {
    e.stopPropagation()
    navigate(`/trip/${trip.id}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col h-full w-full min-h-[340px] sm:min-h-[360px] overflow-hidden rounded-2xl shadow-lg border-2 border-gray-200/50 transition-all duration-300 hover:border-[#017233]/50 hover:shadow-[0_20px_50px_rgba(1,114,51,0.3)] cursor-pointer bg-white"
    >
      {/* Image Section */}
      <div className="relative h-40 sm:h-44 w-full overflow-hidden flex-shrink-0">
        <img
          src={optimizedImageUrl}
          alt={trip.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {trip.freebies && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
            Free Goodies 🎁
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-1.5 p-3 sm:p-4 flex-1 flex-grow">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] sm:text-xs">⏱️ {trip.duration}</span>
        </div>
        <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 group-hover:text-[#017233] transition-colors leading-tight">{trip.title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 font-medium">{getLocationString(trip.location)}</p>

        <div className="flex items-center gap-2 pt-2.5 border-t border-gray-100 mt-auto">
          <button
            type="button"
            className="flex-1 rounded-full border-2 border-[#017233] bg-white text-[#017233] px-3 py-1.5 text-xs font-bold transition-all duration-300 hover:bg-[#017233]/10"
            onClick={handleViewClick}
          >
            View
          </button>
          <button
            type="button"
            className="flex-1 rounded-full bg-[#017233] text-white px-3 py-1.5 text-xs font-bold transition-all duration-300 hover:bg-[#01994d] shadow-md hover:shadow-lg"
            onClick={handleEnquireClick}
          >
            Enquire Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default TripCard
