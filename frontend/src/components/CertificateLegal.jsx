import { useState, useEffect, useRef } from 'react'
import CertificateCard from './card/CertificateCard'
import { certificatesAPI } from '../config/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function CertificateLegal() {
  const [certificates, setCertificates] = useState([])
  const [currentIndices, setCurrentIndices] = useState({})
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const scrollContainerRef = useRef(null)
  const containerRef = useRef(null)
  const autoSlideIntervalRef = useRef(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  // Calculate card width to show exactly 4 cards on desktop, 2 on tablet, 1 on mobile
  useEffect(() => {
    const calculateCardWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const gap = 24 // gap-6 = 24px
        
        // Determine number of cards to show based on screen size
        let cardsToShow = 4 // Desktop default
        if (containerWidth < 640) {
          cardsToShow = 1 // Mobile
        } else if (containerWidth < 1024) {
          cardsToShow = 2 // Tablet
        }
        
        const totalGaps = gap * (cardsToShow - 1) // gaps between cards
        const calculatedWidth = (containerWidth - totalGaps) / cardsToShow
        setCardWidth(calculatedWidth)
      }
    }

    calculateCardWidth()
    window.addEventListener('resize', calculateCardWidth)
    return () => window.removeEventListener('resize', calculateCardWidth)
  }, [certificates])

  // Auto-slide functionality with loop
  useEffect(() => {
    if (certificates.length > 0 && cardWidth > 0) {
      // Clear any existing interval
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current)
      }

      // Set up auto-slide interval
      autoSlideIntervalRef.current = setInterval(() => {
        const cardsToShow = getCardsToShow()
        const maxSlide = Math.max(0, certificates.length - cardsToShow)
        
        setCurrentSlide((prevSlide) => {
          // If at the end, loop back to start, otherwise move to next
          const nextSlide = prevSlide >= maxSlide ? 0 : prevSlide + 1
          scrollToSlide(nextSlide)
          return nextSlide
        })
      }, 4000) // Auto-slide every 4 seconds

      return () => {
        if (autoSlideIntervalRef.current) {
          clearInterval(autoSlideIntervalRef.current)
        }
      }
    }
  }, [certificates, cardWidth])

  useEffect(() => {
    if (certificates.length > 0) {
      const initialIndices = {}
      certificates.forEach((cert) => {
        initialIndices[cert.id] = 0
      })
      setCurrentIndices(initialIndices)

      const intervals = certificates.map((cert) => {
        if (cert.images && cert.images.length > 0) {
          return setInterval(() => {
            setCurrentIndices((prev) => ({
              ...prev,
              [cert.id]: (prev[cert.id] + 1) % cert.images.length
            }))
          }, 3500)
        }
        return null
      }).filter(Boolean)

      return () => {
        intervals.forEach((interval) => clearInterval(interval))
      }
    }
  }, [certificates])

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      const response = await certificatesAPI.getAllCertificates()
      setCertificates(response.certificates || [])
    } catch (error) {
      console.error('Error fetching certificates:', error)
      setCertificates([])
    } finally {
      setLoading(false)
    }
  }

  const goToSlide = (certId, index) => {
    setCurrentIndices((prev) => ({ ...prev, [certId]: index }))
  }

  // Helper function to get number of cards to show based on screen size
  const getCardsToShow = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth
      if (width < 640) return 1 // Mobile
      if (width < 1024) return 2 // Tablet
      return 4 // Desktop
    }
    return 4
  }

  const scrollToSlide = (index) => {
    if (scrollContainerRef.current && cardWidth > 0) {
      const gap = 24 // gap-6 = 24px
      const scrollPosition = index * (cardWidth + gap)
      
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
      setCurrentSlide(index)
    }
  }

  const scrollPrev = () => {
    // Reset auto-slide interval when manually navigating
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current)
    }
    
    const cardsToShow = getCardsToShow()
    const maxSlide = Math.max(0, certificates.length - cardsToShow)
    const prevSlide = currentSlide > 0 ? currentSlide - 1 : maxSlide
    scrollToSlide(prevSlide)
    
    // Restart auto-slide after manual navigation
    restartAutoSlide()
  }

  const scrollNext = () => {
    const cardsToShow = getCardsToShow()
    const maxSlide = Math.max(0, certificates.length - cardsToShow)
    
    // Reset auto-slide interval when manually navigating
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current)
    }
    
    const nextSlide = currentSlide < maxSlide ? currentSlide + 1 : 0
    scrollToSlide(nextSlide)
    
    // Restart auto-slide after manual navigation
    restartAutoSlide()
  }
  
  const restartAutoSlide = () => {
    if (certificates.length > 0 && cardWidth > 0) {
      setTimeout(() => {
        if (autoSlideIntervalRef.current) {
          clearInterval(autoSlideIntervalRef.current)
        }
        
        autoSlideIntervalRef.current = setInterval(() => {
          const cardsToShow = getCardsToShow()
          const maxSlide = Math.max(0, certificates.length - cardsToShow)
          
          setCurrentSlide((prevSlide) => {
            const nextSlide = prevSlide >= maxSlide ? 0 : prevSlide + 1
            scrollToSlide(nextSlide)
            return nextSlide
          })
        }, 4000)
      }, 100)
    }
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
      <section className="w-full bg-white py-4">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Certificate & Legal
            </h2>
          </div>
          <div className="text-center py-6">
            <p className="text-gray-600">Loading certificates...</p>
          </div>
        </div>
      </section>
    )
  }

  if (certificates.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-white py-4">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Certificate & Legal
          </h2>
        </div>

        <div className="relative" ref={containerRef}>
          {/* Navigation Arrows */}
          {certificates.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hidden md:flex items-center justify-center opacity-100 hover:scale-110"
                aria-label="Previous certificate"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hidden md:flex items-center justify-center opacity-100 hover:scale-110"
                aria-label="Next certificate"
              >
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </button>
            </>
          )}

          {/* Slider Container */}
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
            {certificates.map((certificate, index) => (
              <div
                key={certificate.id}
                className="flex-shrink-0 snap-start flex"
                style={{
                  width: cardWidth > 0 ? `${cardWidth}px` : '100%',
                  minWidth: cardWidth > 0 ? `${cardWidth}px` : '100%',
                }}
              >
                <CertificateCard
                  certificate={certificate}
                  currentIndex={currentIndices[certificate.id] || 0}
                  onIndexChange={goToSlide}
                />
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {certificates.length > 4 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.max(0, certificates.length - getCardsToShow() + 1) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 bg-gray-900'
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

export default CertificateLegal

