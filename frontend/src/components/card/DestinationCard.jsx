import { Link } from 'react-router-dom'

function DestinationCard({ destination }) {
  return (
    <Link
      to={`/destination/${encodeURIComponent(destination.name)}`}
      className="group flex flex-col items-center cursor-pointer relative z-0 h-[180px] sm:h-[200px] md:h-[220px]"
    >
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-[#017233]/30 mb-3 ring-2 ring-transparent group-hover:ring-[#017233]/50 z-10 flex-shrink-0">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-115"
        />
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 text-center transition-colors group-hover:text-[#017233] mt-1 relative z-10 flex-shrink-0 line-clamp-2">
        {destination.name}
      </h3>
    </Link>
  )
}

export default DestinationCard

