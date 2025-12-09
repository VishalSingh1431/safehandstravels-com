import { useEffect, useRef } from 'react'

function VideoCard({ video }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const videoElement = videoRef.current
    if (videoElement) {
      // Try to play the video
      const playPromise = videoElement.play()
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Autoplay was prevented, try to play on user interaction
          console.log('Autoplay prevented:', error)
        })
      }

      // Use Intersection Observer to play when video is in viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              videoElement.play().catch(() => {
                // Ignore autoplay errors
              })
            } else {
              videoElement.pause()
            }
          })
        },
        { threshold: 0.5 }
      )

      observer.observe(videoElement)

      return () => {
        observer.disconnect()
      }
    }
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-48 md:h-56 overflow-hidden rounded-t-2xl">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          poster={video.poster}
        >
          <source src={video.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Title Overlay */}
        {video.title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white font-semibold text-sm md:text-base">
              {video.title}
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCard

