import { useState, useEffect } from 'react'
import VideoCard from './card/VideoCard'
import { vibeVideosAPI } from '../config/api'
import { Loader2 } from 'lucide-react'

function VibeWithUs() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

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
      <section className="w-full bg-gradient-to-b from-white to-gray-50 py-12 md:py-16">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Vibe with Us
            </h2>
            <p className="text-gray-600 text-lg">
              Experience the world through our lens
            </p>
          </div>
          <div className="flex justify-center py-12">
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
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-12 md:py-16">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Vibe with Us
          </h2>
          <p className="text-gray-600 text-lg">
            Experience the world through our lens
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {videos.map((video, index) => (
            <VideoCard key={video.id || index} video={video} isTall={video.isTall !== false} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default VibeWithUs

