import VideoCard from './card/VideoCard'

const videos = [
  {
    id: 1,
    title: 'Adventure Awaits',
    youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=60',
    isTall: true // Rectangular card
  },
  {
    id: 2,
    title: 'Mountain Views',
    youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    poster: 'https://images.unsplash.com/photo-1464822759843-d0f9c0d5c51d?auto=format&fit=crop&w=800&q=60',
    isTall: true // Rectangular card
  },
  {
    id: 3,
    title: 'Beach Paradise',
    youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60',
    isTall: true // Rectangular card
  },
  {
    id: 4,
    title: 'City Lights',
    youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    poster: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=60',
    isTall: true // Rectangular card
  }
]

function VibeWithUs() {
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
            <VideoCard key={video.id} video={video} isTall={video.isTall} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default VibeWithUs

