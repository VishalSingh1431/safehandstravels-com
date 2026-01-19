import { useState, useEffect, useRef } from 'react'
import VideoCard from './card/VideoCard'
import { vibeVideosAPI } from '../config/api'
import { Loader2 } from 'lucide-react'

function VibeWithUs() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const sliderRef = useRef(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await vibeVideosAPI.getVibeVideos()
      setVideos(response.videos || [])
    } catch (error) {
      console.error('Error fetching videos:', error)
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="w-full bg-gradient-to-b from-white to-gray-50 py-4 md:py-6">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Vibe with Us
            </h2>
            <p className="text-gray-600 text-lg">
              Experience the world through our lens
            </p>
          </div>
          <div className="flex justify-center py-6">
            <Loader2 className="w-8 h-8 animate-spin text-[#017233]" />
          </div>
        </div>
      </section>
    )
  }

  if (videos.length === 0) {
    return null
  }
  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-4 md:py-6">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Vibe with Us
          </h2>
          <p className="text-gray-600 text-lg">
            Experience the world through our lens
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto scrollbar-hide gap-0 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {videos.map((video, index) => {
              // Preload first 2 videos and videos that are 1-2 positions ahead
              // This ensures smooth scrolling without loading all videos at once
              const shouldPreload = index < 2; // First 2 videos always preload
              
              return (
                <div key={video.id || index} className="flex-shrink-0">
                  <VideoCard 
                    video={video} 
                    isTall={video.isTall !== false}
                    index={index}
                    shouldPreload={shouldPreload}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Hide scrollbar for webkit browsers */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  )
}

export default VibeWithUs

