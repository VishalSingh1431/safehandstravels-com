import { useState, useEffect } from 'react'
import { hotelPartnersAPI } from '../config/api'
import { Loader2 } from 'lucide-react'

// Hotel Partner Logo component
const HotelPartnerLogo = ({ partner }) => {
  const [imageError, setImageError] = useState(false)
  
  const containerClasses = "h-20 md:h-24 lg:h-28 flex items-center justify-center px-4 md:px-6 lg:px-8"
  
  const logoContent = (
    <>
      {partner.logoUrl && !imageError ? (
        <img
          src={partner.logoUrl}
          alt={partner.name}
          className="h-full w-auto max-w-[200px] md:max-w-[240px] lg:max-w-[280px] object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <div className="h-16 md:h-20 lg:h-24 px-6 md:px-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center min-w-[140px]">
          <span className="text-gray-700 font-semibold text-sm md:text-base lg:text-lg whitespace-nowrap">{partner.name}</span>
        </div>
      )}
    </>
  )
  
  if (partner.link) {
    return (
      <a
        href={partner.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${containerClasses} cursor-pointer hover:scale-105 transition-transform duration-300 block relative z-10 pointer-events-auto`}
        aria-label={`Visit ${partner.name}`}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          window.open(partner.link, '_blank', 'noopener,noreferrer')
        }}
      >
        {logoContent}
      </a>
    )
  }
  
  return (
    <div className={containerClasses}>
      {logoContent}
    </div>
  )
}

function HotelPartners() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      const response = await hotelPartnersAPI.getAllPartners()
      // Sort by display order
      const sortedPartners = (response.partners || []).sort((a, b) => {
        const orderA = a.displayOrder || 0
        const orderB = b.displayOrder || 0
        if (orderA !== orderB) return orderA - orderB
        return a.id - b.id
      })
      setPartners(sortedPartners)
    } catch (error) {
      console.error('Error fetching hotel partners:', error)
      setPartners([])
    } finally {
      setLoading(false)
    }
  }

  // Duplicate partners for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners]

  if (loading) {
    return (
      <section className="w-full bg-white py-6 md:py-8 border-b border-gray-100">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </div>
      </section>
    )
  }

  if (partners.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-white py-6 md:py-8 border-b border-gray-100">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Our Hotel Partners
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Trusted hospitality partners for your stay
          </p>
        </div>

        {/* Infinite Scrolling Logo Container */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll items-center pointer-events-auto">
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 relative z-10 pointer-events-auto"
              >
                <HotelPartnerLogo partner={partner} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HotelPartners

