import { useState, useEffect, useRef } from 'react'
import { hotelPartnersAPI } from '../config/api'
import { Loader2, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

// Hotel Partner Logo component - clickable if link exists
const HotelPartnerLogo = ({ partner }) => {
  const [imageError, setImageError] = useState(false)
  
  // Logo is required, so always show image
  const logoContent = (
    <>
      {partner.logoUrl && !imageError ? (
        <img
          src={partner.logoUrl}
          alt={partner.name}
          className="w-full h-full object-contain p-4 opacity-90 hover:opacity-100 transition-opacity duration-300"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full px-6 bg-red-50 border-2 border-red-200 rounded-lg flex flex-col items-center justify-center">
          <span className="text-red-600 font-semibold text-xs md:text-sm text-center mb-1">
            Image Error
          </span>
          <span className="text-red-500 text-xs text-center">
            {partner.name}
          </span>
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
        className="w-full h-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 block relative group"
        aria-label={`Visit ${partner.name}`}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {logoContent}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ExternalLink className="w-4 h-4 text-blue-600" />
        </div>
      </a>
    )
  }
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      {logoContent}
    </div>
  )
}

function HotelPartners() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const scrollContainerRef = useRef(null)
  const autoSlideIntervalRef = useRef(null)
  const [cardWidth, setCardWidth] = useState(0)

  useEffect(() => {
    fetchPartners()
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (partners.length > 0 && scrollContainerRef.current) {
      calculateCardWidth()
      startAutoSlide()
    }
    
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current)
      }
    }
  }, [partners])

  useEffect(() => {
    const handleResize = () => {
      calculateCardWidth()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const calculateCardWidth = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.offsetWidth
      const gap = 24
      
      // Responsive: Show different number of cards based on screen size
      let cardsToShow = 1
      if (containerWidth >= 1024) {
        cardsToShow = 5 // lg: 5 cards
      } else if (containerWidth >= 768) {
        cardsToShow = 4 // md: 4 cards
      } else if (containerWidth >= 640) {
        cardsToShow = 3 // sm: 3 cards
      } else {
        cardsToShow = 2 // mobile: 2 cards
      }
      
      const calculatedWidth = (containerWidth - (gap * (cardsToShow - 1))) / cardsToShow
      setCardWidth(calculatedWidth)
    }
  }

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

  const getCardsToShow = () => {
    if (!scrollContainerRef.current) return 1
    const containerWidth = scrollContainerRef.current.offsetWidth
    if (containerWidth >= 1024) return 5
    if (containerWidth >= 768) return 4
    if (containerWidth >= 640) return 3
    return 2
  }

  const scrollToSlide = (slideIndex) => {
    if (scrollContainerRef.current && cardWidth > 0) {
      const gap = 24
      const scrollPosition = slideIndex * (cardWidth + gap)
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
      setCurrentSlide(slideIndex)
    }
  }

  const startAutoSlide = () => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current)
    }
    
    if (partners.length > getCardsToShow()) {
      autoSlideIntervalRef.current = setInterval(() => {
        const cardsToShow = getCardsToShow()
        const maxSlide = Math.max(0, partners.length - cardsToShow)
        
        setCurrentSlide((prevSlide) => {
          const nextSlide = prevSlide >= maxSlide ? 0 : prevSlide + 1
          scrollToSlide(nextSlide)
          return nextSlide
        })
      }, 4000) // Auto-slide every 4 seconds
    }
  }

  const scrollPrev = () => {
    const cardsToShow = getCardsToShow()
    const maxSlide = Math.max(0, partners.length - cardsToShow)
    
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current)
    }
    
    const prevSlide = currentSlide > 0 ? currentSlide - 1 : maxSlide
    scrollToSlide(prevSlide)
    
    setTimeout(() => {
      startAutoSlide()
    }, 100)
  }

  const scrollNext = () => {
    const cardsToShow = getCardsToShow()
    const maxSlide = Math.max(0, partners.length - cardsToShow)
    
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current)
    }
    
    const nextSlide = currentSlide < maxSlide ? currentSlide + 1 : 0
    scrollToSlide(nextSlide)
    
    setTimeout(() => {
      startAutoSlide()
    }, 100)
  }

  const handleScroll = () => {
    if (scrollContainerRef.current && cardWidth > 0) {
      const gap = 24
      const scrollLeft = scrollContainerRef.current.scrollLeft
      const newSlide = Math.round(scrollLeft / (cardWidth + gap))
      setCurrentSlide(newSlide)
    }
  }

  if (loading) {
    return (
      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
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

  const cardsToShow = getCardsToShow()
  const maxSlide = Math.max(0, partners.length - cardsToShow)
  const showNavigation = partners.length > cardsToShow

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
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

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {showNavigation && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-20 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                aria-label="Previous partners"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-20 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                aria-label="Next partners"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}

          {/* Slider */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex-shrink-0 snap-start"
                style={{
                  width: cardWidth > 0 ? `${cardWidth}px` : '100%',
                  minWidth: cardWidth > 0 ? `${cardWidth}px` : '100%',
                }}
              >
                <div className="h-32 md:h-40 lg:h-44 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <HotelPartnerLogo partner={partner} />
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {showNavigation && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 bg-blue-600'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default HotelPartners
