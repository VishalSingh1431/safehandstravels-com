import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Reviews from '../components/Reviews'
import { enquiriesAPI, blogsAPI } from '../config/api'
import SEO from '../components/SEO'
import { useToast } from '../contexts/ToastContext'
import { Calendar, MapPin, Phone, User, Plane, DollarSign, PhoneCall, Loader2 } from 'lucide-react'
import PhoneInputWithCountry from '../components/PhoneInputWithCountry'
import { isValidPhone } from '../utils/countryCodes'

function CustomisedTrip() {
  const navigate = useNavigate()
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    destination: '',
    travelDates: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [blogsLoading, setBlogsLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogsLoading(true)
        const res = await blogsAPI.getAllBlogs('', '', '', 6, 0)
        const list = (res.blogs || res || []).filter(b => b.status === 'published' || !b.status)
        setRelatedBlogs(Array.isArray(list) ? list : [])
      } catch (_) {
        setRelatedBlogs([])
      } finally {
        setBlogsLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const handleBlogClick = (blog) => {
    if (blog.slug) navigate(`/blog/${blog.slug}`)
    else navigate(`/blog/${blog.id}`)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.phone.trim() || !isValidPhone(formData.phone)) {
      toast.error('Please enter a valid name and phone number (with country code)')
      return
    }

    setIsSubmitting(true)

    try {
      await enquiriesAPI.createEnquiry({
        name: formData.name.trim(),
        email: `customize+${Date.now()}@safehandstravels.com`, // Placeholder email
        phone: formData.phone.trim(),
        message: `Customize Trip Request - Destination: ${formData.destination || 'Not specified'}, Travel Dates: ${formData.travelDates || 'Not specified'}`,
      })

      toast.success('Thank you! Our travel expert will connect with you soon to customize your trip.')
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        destination: '',
        travelDates: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(error.message || 'Failed to submit. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SEO
        title="Customise Your Trip | Safe Hands Travels"
        description="Create your perfect customized trip package. Tailored itineraries designed to match your preferences, schedule, and budget for an unforgettable travel experience across India."
        keywords="customized trips, personalized travel, tailor-made tours, India travel packages, custom itineraries"
        url="/customise-trip"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
        {/* 1. Main Content & Form Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="mx-auto w-full max-w-7xl px-2 sm:px-3 lg:px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Side - Content Area */}
              <div className="space-y-6 lg:space-y-8">
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    Plan Your Trip, Your Way
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    Tell us your preferences and we'll craft the perfect itinerary for you.
                  </p>
                </div>

                {/* Feature Icons */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Flexible itinerary</h3>
                      <p className="text-gray-600 text-sm">Customize your schedule to match your pace and interests</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Best price guarantee</h3>
                      <p className="text-gray-600 text-sm">Get the best value without compromising on quality</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center">
                      <PhoneCall className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Expert travel support</h3>
                      <p className="text-gray-600 text-sm">24/7 assistance from our travel experts throughout your journey</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form Card */}
              <div className="lg:sticky lg:top-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Started</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Input */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233]/20 focus:border-[#017233] transition-all outline-none text-gray-900 placeholder-gray-400"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <PhoneInputWithCountry
                        id="phone"
                        value={formData.phone}
                        onChange={(v) => setFormData(prev => ({ ...prev, phone: v }))}
                        required
                        placeholder="Enter phone number"
                        className="rounded-lg"
                      />
                    </div>

                    {/* Destination Input */}
                    <div>
                      <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                        Destination
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="destination"
                          name="destination"
                          value={formData.destination}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233]/20 focus:border-[#017233] transition-all outline-none text-gray-900 placeholder-gray-400"
                          placeholder="Where do you want to go?"
                        />
                      </div>
                    </div>

                    {/* Travel Dates Input */}
                    <div>
                      <label htmlFor="travelDates" className="block text-sm font-medium text-gray-700 mb-2">
                        Travel Dates <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          id="travelDates"
                          name="travelDates"
                          value={formData.travelDates}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233]/20 focus:border-[#017233] transition-all outline-none text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-br from-[#017233] to-[#01994d] text-white py-3 px-6 rounded-lg font-semibold text-base hover:shadow-xl hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Plane className="w-5 h-5" />
                          Customize My Trip
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Reviews Section */}
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

        {/* 3. Related Blogs Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto w-full max-w-7xl px-2 sm:px-3 lg:px-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
              Related Blogs
            </h2>
            {blogsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-[#017233]" />
              </div>
            ) : relatedBlogs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No related blogs at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {relatedBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    onClick={() => handleBlogClick(blog)}
                    className="group relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={blog.heroImage || blog.imageUrl || blog.image || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'}
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

export default CustomisedTrip

