function DestinationCard({ destination }) {
  return (
    <div className="group flex flex-col items-center cursor-pointer relative z-0">
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md mb-3 ring-2 ring-transparent group-hover:ring-[#017233]/20 z-10">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-115"
        />
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 text-center transition-colors group-hover:text-[#017233] mt-1 relative z-10">
        {destination.name}
      </h3>
    </div>
  )
}

export default DestinationCard

