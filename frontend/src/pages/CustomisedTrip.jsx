import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TripCard from '../components/card/TripCard'
import Reviews from '../components/Reviews'
import { tripsAPI } from '../config/api'
import SEO from '../components/SEO'

function CustomisedTrip() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFullDescription, setShowFullDescription] = useState(false)
  
  // Sample blog data - replace with actual API call if needed
  const relatedBlogs = [
    { id: 1, title: 'Exploring the Mystical Beauty of Ladakh', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: 'Spiritual Journey Through Kashi', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
    { id: 3, title: 'Adventure in Spiti Valley', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80' }
  ]

  // Sample trip description
  const tripDescription = {
    short: "Plan your perfect journey with our customized trip packages. Tailored to your preferences, schedule, and budget, we create unforgettable travel experiences across India. Whether you're seeking spiritual enlightenment, adventure, cultural immersion, or relaxation, our expert team designs itineraries that match your dreams.",
    full: "Plan your perfect journey with our customized trip packages. Tailored to your preferences, schedule, and budget, we create unforgettable travel experiences across India. Whether you're seeking spiritual enlightenment, adventure, cultural immersion, or relaxation, our expert team designs itineraries that match your dreams.\n\nOur customized trip service goes beyond standard packages. We take the time to understand your interests, travel style, and specific requirements. From the moment you reach out to us, our travel consultants work closely with you to craft a unique itinerary that includes:\n\n• Personal consultation to understand your preferences\n• Flexible scheduling based on your availability\n• Customized accommodation choices\n• Personalized sightseeing and activity options\n• Budget-friendly options without compromising quality\n• 24/7 support during your journey\n\nExperience the freedom of traveling on your terms while benefiting from our expertise in Indian destinations. Let us transform your travel aspirations into reality with a customized trip that's uniquely yours."
  }

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const response = await tripsAPI.getAllTrips('', 7, 0)
      // Limit to 6-7 trips as per requirement
      const limitedTrips = (response.trips || []).slice(0, 7)
      setTrips(limitedTrips)
    } catch (error) {
      console.error('Error fetching trips:', error)
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

  const handleBlogClick = (blog) => {
    navigate(`/blog/${blog.id}`)
  }

  const handleReadMore = () => {
    setShowFullDescription(true)
    // Scroll to description section when opened
    setTimeout(() => {
      const element = document.getElementById('trip-description')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleCloseDescription = () => {
    setShowFullDescription(false)
  }

  return (
    <>
      <SEO
        title="Customise Your Trip | Safe Hands Travels"
        description="Create your perfect customized trip package. Tailored itineraries designed to match your preferences, schedule, and budget for an unforgettable travel experience across India."
        keywords="customized trips, personalized travel, tailor-made tours, India travel packages, custom itineraries"
        url="/customise-trip"
      />
      
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        {/* 1. Hero Section - Large Photo */}
        <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1920&q=80)'
            }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 drop-shadow-2xl">
              Customise Your Trip
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-lg">
              Create Your Perfect Journey, Tailored Just For You
            </p>
          </div>
        </section>

        {/* 2. Trip Description Section */}
        <section id="trip-description" className="py-12 md:py-16 bg-white">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {!showFullDescription ? (
                <div>
                  <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed mb-6">
                    {tripDescription.short}
                  </p>
                  <button
                    onClick={handleReadMore}
                    className="inline-flex items-center gap-2 bg-gradient-to-br from-[#017233] to-[#01994d] text-white px-6 py-3 rounded-full font-semibold text-base hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Read More
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 lg:p-12">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                      About Customized Trips
                    </h2>
                    <button
                      onClick={handleCloseDescription}
                      className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
                      aria-label="Close description"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed whitespace-pre-line">
                      {tripDescription.full}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. Trip Plans / Packages Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
                Available Trip Plans
              </h2>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Loading trip plans...</p>
              </div>
            ) : trips.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No trip plans available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* 4. Reviews Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
                What Our Travelers Say
              </h2>
            </div>
            <Reviews />
          </div>
        </section>

        {/* 5. Related Blogs Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
              Related Blogs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedBlogs.map((blog) => (
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

export default CustomisedTrip

