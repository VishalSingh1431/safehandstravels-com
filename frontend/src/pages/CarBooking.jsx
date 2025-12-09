import { useState } from 'react'

function CarBooking() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    fromDate: '',
    toDate: '',
    numberOfAdults: '',
    numberOfChildren: ''
  })

  const [connectFormData, setConnectFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  })

  const drivers = [
    {
      id: 1,
      name: 'Mr. Anup Kumar',
      car: 'Innova Crysta- 7 Seater',
      experience: '35+ Years of Experience'
    },
    {
      id: 2,
      name: 'Mr. Prerak Sethi',
      car: 'Maruti Suzuki Ertiga - 7 Seater',
      experience: '8+ Years of Experience'
    },
    {
      id: 3,
      name: 'Mr. Kuber Prasad',
      car: 'Innova Crysta- 7 Seater',
      experience: '30+ Years of Experience'
    },
    {
      id: 4,
      name: 'Mr. Milap Chand',
      car: 'Innova Crysta- 7 Seater',
      experience: '30+ Years of Experience'
    },
    {
      id: 5,
      name: 'Mr. Adesh Kumar Shishodia',
      car: 'Innova Crysta- 7 Seater',
      experience: '27+ Years of Experience'
    },
    {
      id: 6,
      name: 'Mr. Monu Kumar Yadav',
      car: 'Force Tempo Traveller - 12 Seater',
      experience: '15+ Years of Experience'
    },
    {
      id: 7,
      name: 'Mr. Ravi Kumar',
      car: 'Innova Crysta- 7 Seater',
      experience: '19+ Years of Experience'
    },
    {
      id: 8,
      name: 'Mr. Sanjay',
      car: 'Innova Crysta- 7 Seater',
      experience: '7+ Years of Experience'
    }
  ]

  const features = [
    'Experienced Tourist Driver',
    'Good with English Speaking',
    'Police Verified Drivers',
    'Uniformed Drivers',
    'Clean and Non Smelly Cars',
    'Free WiFi'
  ]

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Booking form submitted:', formData)
    // You can add API call here
  }

  const handleConnectSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Connect form submitted:', connectFormData)
    // You can add API call here
  }

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target
    if (formType === 'booking') {
      setFormData(prev => ({ ...prev, [name]: value }))
    } else {
      setConnectFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#017233] via-[#01994d] to-[#00C853]">
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl">
            Car Rentals
          </h1>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Left Column - Image and Features */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Commitment</h2>
              <div className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <svg className="w-32 h-32 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#017233] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Send Enquiry</h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange(e, 'booking')}
                    placeholder="Enter your first name here"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange(e, 'booking')}
                    placeholder="Enter your last name here"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange(e, 'booking')}
                  placeholder="+1 212-695-1962"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, 'booking')}
                  placeholder="user@website.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fromDate" className="block text-sm font-semibold text-gray-700 mb-2">
                    From Date *
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={(e) => handleInputChange(e, 'booking')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="toDate" className="block text-sm font-semibold text-gray-700 mb-2">
                    To Date *
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    name="toDate"
                    value={formData.toDate}
                    onChange={(e) => handleInputChange(e, 'booking')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="numberOfAdults" className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Adults *
                  </label>
                  <input
                    type="number"
                    id="numberOfAdults"
                    name="numberOfAdults"
                    value={formData.numberOfAdults}
                    onChange={(e) => handleInputChange(e, 'booking')}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="numberOfChildren" className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Children
                  </label>
                  <input
                    type="number"
                    id="numberOfChildren"
                    name="numberOfChildren"
                    value={formData.numberOfChildren}
                    onChange={(e) => handleInputChange(e, 'booking')}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#017233] text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-[#015a28] transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Send Enquiry
              </button>
            </form>
          </div>
        </div>

        {/* Driver Listings Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8 md:mb-12">
            Know your Safe Hands for Taxi's
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{driver.name}</h3>
                <p className="text-gray-700 mb-2 font-medium">{driver.car}</p>
                <p className="text-gray-600 mb-4">{driver.experience}</p>
                <button className="w-full bg-[#017233] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#015a28] transition-colors duration-300">
                  Know More &gt;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Connect With Us Now Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 relative z-10">
            {/* Left Side - Connect Information */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Connect With Us Now</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Welcome to Safe Hands Travels, where every journey is crafted with your safety and satisfaction in mind.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <a
                  href="tel:+918448801998"
                  className="text-xl font-semibold hover:underline"
                >
                  +91 8448801998
                </a>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-2">How can we help?</h3>
              <p className="text-white/90 mb-6">We will connect with you at the earliest.</p>
              <form onSubmit={handleConnectSubmit} className="space-y-4">
                <div>
                  <label htmlFor="connectFirstName" className="block text-sm font-semibold text-white mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="connectFirstName"
                    name="firstName"
                    value={connectFormData.firstName}
                    onChange={(e) => handleInputChange(e, 'connect')}
                    className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="connectLastName" className="block text-sm font-semibold text-white mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="connectLastName"
                    name="lastName"
                    value={connectFormData.lastName}
                    onChange={(e) => handleInputChange(e, 'connect')}
                    className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="connectEmail" className="block text-sm font-semibold text-white mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="connectEmail"
                    name="email"
                    value={connectFormData.email}
                    onChange={(e) => handleInputChange(e, 'connect')}
                    className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="connectPhone" className="block text-sm font-semibold text-white mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="connectPhone"
                    name="phoneNumber"
                    value={connectFormData.phoneNumber}
                    onChange={(e) => handleInputChange(e, 'connect')}
                    className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-teal-700 py-3 px-6 rounded-lg font-semibold text-lg hover:bg-white/90 transition-colors duration-300 shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarBooking

