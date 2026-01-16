import { useState, useEffect, useRef } from 'react'
import WrittenReviewCard from './card/WrittenReviewCard'
import { writtenReviewsAPI } from '../config/api'

function WrittenReviews() {
  const [writtenReviews, setWrittenReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const carouselRef = useRef(null)

  useEffect(() => {
    fetchWrittenReviews()
  }, [])

  useEffect(() => {
    // Reset carousel index when showAll changes
    setCurrentIndex(0)
  }, [showAll])

  const fetchWrittenReviews = async () => {
    try {
      setLoading(true)
      const response = await writtenReviewsAPI.getAllWrittenReviews()
      setWrittenReviews(response.writtenReviews || [])
    } catch (error) {
      console.error('Error fetching written reviews:', error)
      setWrittenReviews([])
    } finally {
      setLoading(false)
    }
  }

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    const displayedReviews = showAll ? writtenReviews : writtenReviews.slice(0, 4)
    
    if (isLeftSwipe && currentIndex < displayedReviews.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToNext = () => {
    const displayedReviews = showAll ? writtenReviews : writtenReviews.slice(0, 4)
    setCurrentIndex((prev) => (prev + 1) % displayedReviews.length)
  }

  const goToPrevious = () => {
    const displayedReviews = showAll ? writtenReviews : writtenReviews.slice(0, 4)
    setCurrentIndex((prev) => (prev - 1 + displayedReviews.length) % displayedReviews.length)
  }
  if (loading) {
    return (
      <section className="w-full bg-gradient-to-b from-white to-gray-50 py-12 md:py-16">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 lg:p-12">
              <div className="text-center py-12">
                <p className="text-gray-600">Loading written reviews...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (writtenReviews.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-12 md:py-16">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 lg:p-12">
            {/* Header Card */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  ✍️
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Written Reviews
                </h2>
              </div>
            </div>

            {/* Mobile Carousel - Hidden on md and above */}
            <div className="md:hidden relative">
              <div
                ref={carouselRef}
                className="overflow-hidden touch-pan-x"
                style={{ touchAction: 'pan-x' }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {(showAll ? writtenReviews : writtenReviews.slice(0, 4)).map((review) => (
                    <div key={review.id} className="min-w-full px-2">
                      <WrittenReviewCard review={review} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows - Mobile Only */}
              {(showAll ? writtenReviews : writtenReviews.slice(0, 4)).length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg transition-all z-10"
                    aria-label="Previous review"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg transition-all z-10"
                    aria-label="Next review"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Dots Indicator - Mobile Only */}
              {(showAll ? writtenReviews : writtenReviews.slice(0, 4)).length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {(showAll ? writtenReviews : writtenReviews.slice(0, 4)).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? 'w-8 bg-[#017233]'
                          : 'w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to review ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Grid - Hidden on mobile */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {(showAll ? writtenReviews : writtenReviews.slice(0, 4)).map((review) => (
                <WrittenReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* Show All / Show Less Button */}
            {writtenReviews.length > 4 && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="bg-gradient-to-br from-[#017233] to-[#01994d] text-white px-8 py-3 rounded-xl font-bold text-base hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {showAll ? 'Show Less' : 'Show All Reviews'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WrittenReviews

