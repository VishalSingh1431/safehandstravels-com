import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Loader2 } from 'lucide-react'
import SEO from '../components/SEO'
import { blogsAPI } from '../config/api'

function Experiences() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [latestBlogs, setLatestBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Fallback destinations (used if you later add a destinations API)
  const destinations = [
    { id: 1, name: 'Ladakh', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Kashi', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Spiti', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Meghalaya', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80' },
    { id: 5, name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80' },
    { id: 6, name: 'Kerala', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' }
  ]

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const response = await blogsAPI.getAllBlogs('', '', appliedSearch.trim(), 50, 0)
        setLatestBlogs(response.blogs || [])
      } catch (err) {
        console.error('Error fetching blogs:', err)
        setLatestBlogs([])
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [appliedSearch])

  const handleSearch = (e) => {
    e.preventDefault()
    setAppliedSearch(searchQuery)
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
          <div className="mx-auto w-full max-w-4xl px-2 sm:px-3 lg:px-4">
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

        {/* Related Blogs Section - Explore by Destination */}
        <section className="py-12 md:py-16 bg-white">
          <div className="mx-auto w-full max-w-7xl px-2 sm:px-3 lg:px-4">
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

        {/* Latest Blogs Section - from API (published blogs only) */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="mx-auto w-full max-w-7xl px-2 sm:px-3 lg:px-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
              Latest Blogs
            </h2>
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-12 h-12 animate-spin text-[#017233]" />
              </div>
            ) : latestBlogs.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p className="text-lg">No blogs found.</p>
                <p className="text-sm mt-2">In Admin, add a blog and set its status to <strong>Published</strong> for it to appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {latestBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    onClick={() => handleBlogClick(blog)}
                    className="group relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                      <img
                        src={blog.heroImage || blog.hero_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'}
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
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default Experiences

