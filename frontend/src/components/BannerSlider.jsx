import { useState, useEffect } from 'react'

const bannerImages = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=60',
    title: 'Discover Amazing Destinations',
    subtitle: 'Explore the world with us'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=60',
    title: 'Unforgettable Adventures',
    subtitle: 'Create memories that last forever'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1523906630133-f6934a1ab6c8?auto=format&fit=crop&w=1600&q=60',
    title: 'Travel in Style',
    subtitle: 'Premium experiences at your fingertips'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73bb2?auto=format&fit=crop&w=1600&q=60',
    title: 'Journey Beyond Boundaries',
    subtitle: 'Discover new horizons with confidence'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=60',
    title: 'Your Next Adventure Awaits',
    subtitle: 'Start planning your perfect trip today'
  }
]

function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerImages.length)
  }

  return (
    <section className="w-full bg-gray-50 py-6 sm:py-8">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
          {bannerImages.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-start justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-white">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 max-w-2xl">
                  {banner.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl max-w-xl">
                  {banner.subtitle}
                </p>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full p-1.5 sm:p-2 transition-all z-10"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full p-1.5 sm:p-2 transition-all z-10"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BannerSlider

