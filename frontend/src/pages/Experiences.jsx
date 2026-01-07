import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import SEO from '../components/SEO'

function Experiences() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [instagramFollowers, setInstagramFollowers] = useState(0)
  const [googleReviews, setGoogleReviews] = useState(0)

  // Sample data - replace with actual API calls
  const destinations = [
    { id: 1, name: 'Ladakh', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Kashi', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Spiti', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Meghalaya', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80' },
    { id: 5, name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80' },
    { id: 6, name: 'Kerala', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' }
  ]

  const latestBlogs = [
    { id: 1, title: 'Exploring the Mystical Beauty of Ladakh', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: 'Spiritual Journey Through Kashi', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
    { id: 3, title: 'Adventure in Spiti Valley', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80' },
    { id: 4, title: 'Meghalaya: The Abode of Clouds', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80' },
    { id: 5, title: 'Beach Paradise in Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80' },
    { id: 6, title: 'Backwaters of Kerala', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' }
  ]

  // Animated counter effect
  useEffect(() => {
    const targetInstagram = 12500 // Replace with actual Instagram followers count
    const targetGoogle = 450 // Replace with actual Google reviews count
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepTime = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      
      setInstagramFollowers(Math.floor(targetInstagram * easeOutQuart))
      setGoogleReviews(Math.floor(targetGoogle * easeOutQuart))

      if (currentStep >= steps) {
        setInstagramFollowers(targetInstagram)
        setGoogleReviews(targetGoogle)
        clearInterval(timer)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    // Handle search functionality
    console.log('Searching for:', searchQuery)
  }

  const handleDestinationClick = (destination) => {
    navigate(`/blog/destination/${destination.id}`)
  }

  const handleBlogClick = (blog) => {
    navigate(`/blog/${blog.id}`)
  }

  return (
    <>
      <SEO
        title="Blogs Experiences | Safe Hands Travels"
        description="Discover amazing travel experiences, blogs, and stories from destinations across India. Read about adventures, spiritual journeys, and cultural experiences."
        keywords="travel blogs, experiences, travel stories, India travel, destinations, adventure travel"
        url="/experiences"
      />
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1920&q=80)'
            }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
              Blogs Experiences
            </h1>
          </div>
        </section>

        {/* Blog Search Bar */}
        <section className="py-8 md:py-12 bg-white">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs or destinations..."
                className="w-full px-6 py-4 md:py-5 text-lg rounded-full border-2 border-gray-200 focus:border-[#017233] focus:ring-4 focus:ring-[#017233]/20 outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-[#017233] text-white rounded-full hover:bg-[#01994d] transition-colors duration-300 shadow-lg hover:shadow-xl"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 to-white">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-16">
              {/* Instagram Followers */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#017233] mb-2">
                  {instagramFollowers.toLocaleString()}+
                </div>
                <div className="text-lg md:text-xl text-gray-600 font-semibold">
                  Instagram Followers
                </div>
              </div>

              {/* Google Reviews */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#017233] mb-2">
                  {googleReviews.toLocaleString()}+
                </div>
                <div className="text-lg md:text-xl text-gray-600 font-semibold">
                  Google Reviews
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Blogs Section - Explore by Destination */}
        <section className="py-12 md:py-16 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
              Explore by Destination
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {destinations.map((destination) => (
                <div
                  key={destination.id}
                  onClick={() => handleDestinationClick(destination)}
                  className="group relative aspect-square rounded-xl md:rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex items-end justify-center p-4">
                    <h3 className="text-white font-bold text-lg md:text-xl text-center drop-shadow-lg">
                      {destination.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Blogs Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
              Latest Blogs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {latestBlogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => handleBlogClick(blog)}
                  className="group relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-[#017233] transition-colors duration-300 line-clamp-2">
                      {blog.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Experiences

