import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

function CertificateCard({ certificate, currentIndex, onIndexChange }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const goToSlide = (index) => {
    onIndexChange(certificate.id, index)
  }

  // Check if description is long enough to need truncation
  const description = certificate.description || ''
  const shouldTruncate = description.length > 150 // Adjust threshold as needed

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200/50 overflow-hidden hover:border-[#017233]/50 hover:shadow-[0_20px_50px_rgba(1,114,51,0.3)] transition-all duration-300 flex flex-col h-full w-full min-h-[500px] md:min-h-[540px]">
      <div className="relative h-64 md:h-72 overflow-hidden rounded-t-2xl flex-shrink-0">
        {/* Main Image Display */}
        {certificate.images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ${
              index === currentIndex
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
            }`}
          >
            <img
              src={image}
              alt={`${certificate.title} ${index + 1}`}
              className="w-full h-full object-cover rounded-t-2xl"
            />
          </div>
        ))}

        {/* Circular Thumbnail Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {certificate.images.map((image, index) => {
            const isActive = index === currentIndex
            const totalImages = certificate.images.length
            const angle = (360 / totalImages) * (index - currentIndex)
            const radius = 45
            const x = Math.cos((angle * Math.PI) / 180) * radius
            const y = Math.sin((angle * Math.PI) / 180) * radius
            
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`absolute transition-all duration-500 rounded-full overflow-hidden border-2 ${
                  isActive
                    ? 'w-12 h-12 border-white scale-110 z-30'
                    : 'w-8 h-8 border-white/50 scale-100 opacity-70 hover:opacity-100'
                }`}
                style={{
                  transform: isActive
                    ? 'translate(-50%, -50%)'
                    : `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                }}
                aria-label={`Go to slide ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            )
          })}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1 min-h-[180px]">
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex-shrink-0">
          {certificate.title}
        </h3>
        <div className="flex-grow flex flex-col">
          <p className={`text-gray-600 ${!isExpanded && shouldTruncate ? 'line-clamp-3' : ''}`}>
            {description}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 flex items-center gap-1 text-[#017233] font-semibold text-sm hover:text-[#015a26] transition-colors self-start flex-shrink-0"
            >
              {isExpanded ? (
                <>
                  <span>Read less</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Read more</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CertificateCard

