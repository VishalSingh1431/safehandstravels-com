import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import ContactUsFormComponent from '../components/ContactUs'
import SEO from '../components/SEO'
import { teamsAPI } from '../config/api'

function ContactUs() {
  const location = useLocation()
  const [teams, setTeams] = useState([])
  const [loadingTeams, setLoadingTeams] = useState(true)
  const hasScrolled = useRef(false)

  useEffect(() => {
    fetchTeams()
  }, [])

  // Helper function to scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    
    if (element) {
      // Get navbar height
      const navbar = document.querySelector('nav')
      const navbarHeight = navbar ? navbar.offsetHeight : 100
      // Get sticky header height if exists
      const stickyHeader = document.querySelector('.sticky.top-16')
      const stickyHeaderHeight = stickyHeader ? stickyHeader.offsetHeight : 0
      // Extra spacing for nested sections (like cancellation, privacy, terms inside policies)
      const extraSpacing = ['cancellation', 'privacy', 'terms'].includes(sectionId) ? 30 : 0
      // Total offset
      const offset = navbarHeight + stickyHeaderHeight + 20 + extraSpacing
      
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset
      
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      })
    }
  }

  // Scroll to section when page loads with hash
  useEffect(() => {
    const handleHashScroll = () => {
      if (location.hash && !hasScrolled.current) {
        const hash = location.hash.substring(1) // Remove the # symbol
        
        // Wait a bit for page to fully render
        setTimeout(() => {
          scrollToSection(hash)
          hasScrolled.current = true
        }, 600)
      }
    }
    
    // Scroll when hash is present
    handleHashScroll()
    
    // Reset scroll flag when component unmounts
    return () => {
      hasScrolled.current = false
    }
  }, [location.hash, location.pathname])

  const fetchTeams = async () => {
    try {
      setLoadingTeams(true)
      const response = await teamsAPI.getAllTeams()
      setTeams(response.teams || [])
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoadingTeams(false)
    }
  }

  // Handle anchor link clicks for smooth scrolling
  const handleAnchorClick = (e, targetId) => {
    e.preventDefault()
    scrollToSection(targetId)
    
    // Update URL hash without scrolling again
    window.history.pushState(null, '', `#${targetId}`)
    
    // Reset scroll flag to allow re-scrolling if same hash is clicked
    hasScrolled.current = false
  }

  return (
    <>
      <SEO
        title="Contact Us - Safe Hands Travels"
        description="Contact Safe Hands Travels for travel assistance, queries, and support. Learn about us, our team, policies, and get 24/7 support for your travel needs."
        keywords="contact, travel support, about us, team, policies, travel insurance, cancellation policy, privacy policy, terms and conditions"
        url="/contact-us"
      />
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-br from-[#017233] via-[#01994d] to-[#00C853] text-white py-6 md:py-8">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-lg">
                Contact Us
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Get in touch with us for travel assistance, queries, and support. We're here to help you plan your perfect journey.
              </p>
            </div>
          </div>
        </section>

        {/* Navigation Links */}
        <div className="sticky top-16 md:top-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40 shadow-sm">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto scrollbar-hide gap-4 py-4">
              <a href="#about-us" onClick={(e) => handleAnchorClick(e, 'about-us')} className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#017233] hover:bg-green-50 rounded-lg transition-all">
                About Us
              </a>
              <a href="#our-team" onClick={(e) => handleAnchorClick(e, 'our-team')} className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#017233] hover:bg-green-50 rounded-lg transition-all">
                Our Team
              </a>
              <a href="#travel-insurance" onClick={(e) => handleAnchorClick(e, 'travel-insurance')} className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#017233] hover:bg-green-50 rounded-lg transition-all">
                Travel Insurance
              </a>
              <a href="#visa-assistance" onClick={(e) => handleAnchorClick(e, 'visa-assistance')} className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#017233] hover:bg-green-50 rounded-lg transition-all">
                Visa Assistance
              </a>
              <a href="#support" onClick={(e) => handleAnchorClick(e, 'support')} className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#017233] hover:bg-green-50 rounded-lg transition-all">
                24/7 Support
              </a>
              <a href="#policies" onClick={(e) => handleAnchorClick(e, 'policies')} className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#017233] hover:bg-green-50 rounded-lg transition-all">
                Policies
              </a>
              <a href="#cancellation" onClick={(e) => handleAnchorClick(e, 'cancellation')} className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#017233] hover:bg-green-50 rounded-lg transition-all">
                Cancellation Policy
              </a>
              <a href="#privacy" onClick={(e) => handleAnchorClick(e, 'privacy')} className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#017233] hover:bg-green-50 rounded-lg transition-all">
                Privacy Policy
              </a>
              <a href="#terms" onClick={(e) => handleAnchorClick(e, 'terms')} className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#017233] hover:bg-green-50 rounded-lg transition-all">
                Terms & Conditions
              </a>
              <a href="#contact-form" onClick={(e) => handleAnchorClick(e, 'contact-form')} className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#017233] hover:bg-green-50 rounded-lg transition-all">
                Contact Form
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          {/* About Us Section */}
          <section id="about-us" className="mb-4 md:mb-6 scroll-mt-24">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    ℹ️
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                    About Us
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                  <p>
                    Safe Hands Travels is your trusted domestic travel partner dedicated to creating unforgettable experiences across India. With years of experience in the travel industry, we specialize in crafting personalized journeys that cater to your unique interests and preferences.
                  </p>
                  <p>
                    Our mission is to provide safe, reliable, and memorable travel experiences while ensuring excellent customer service. Whether you're looking for adventure, spiritual journeys, cultural exploration, or wellness retreats, we have the expertise to make your travel dreams come true.
                  </p>
                  <p>
                    We believe in responsible tourism and sustainable travel practices that benefit local communities and preserve the beauty of our destinations for future generations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Team Section */}
          <section id="our-team" className="mb-4 md:mb-6 scroll-mt-24">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    👥
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                    Our Team
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none text-gray-700 space-y-6 mb-8">
                  <p>
                    Our team consists of passionate travel experts, experienced guides, and dedicated support staff who are committed to ensuring your journey is smooth and memorable.
                  </p>
                  <p>
                    From trip planning and booking to on-ground support during your travels, our team is available round the clock to assist you. We have deep knowledge of India's diverse destinations and can help you discover hidden gems and authentic experiences.
                  </p>
                </div>

                {/* Team Members Grid */}
                {loadingTeams ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#017233]"></div>
                  </div>
                ) : teams.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {teams.map((team) => (
                      <div
                        key={team.id}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                      >
                        <div className="p-6">
                          <div className="flex flex-col items-center text-center mb-4">
                            {team.photoUrl ? (
                              <div className="relative mb-4">
                                <img
                                  src={team.photoUrl}
                                  alt={team.name}
                                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] border-2 border-white flex items-center justify-center shadow-md">
                                  <span className="text-white text-xs font-bold">✓</span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg mb-4">
                                {team.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-1 group-hover:text-[#017233] transition-colors">
                              {team.name}
                            </h3>
                            {team.position && (
                              <p className="text-sm sm:text-base text-gray-600 font-medium mb-3">
                                {team.position}
                              </p>
                            )}
                          </div>

                          {team.bio && (
                            <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">
                              {team.bio}
                            </p>
                          )}

                          <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-200">
                            {team.email && (
                              <a
                                href={`mailto:${team.email}`}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                                aria-label={`Email ${team.name}`}
                                title={`Email ${team.name}`}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </a>
                            )}
                            {team.socialLinkedIn && (
                              <a
                                href={team.socialLinkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-700 to-blue-800 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                                aria-label={`${team.name}'s LinkedIn`}
                                title="LinkedIn"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                              </a>
                            )}
                            {team.phone && (
                              <a
                                href={`tel:${team.phone}`}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                                aria-label={`Call ${team.name}`}
                                title={`Call ${team.name}`}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {/* Travel Insurance Section */}
          <section id="travel-insurance" className="mb-4 md:mb-6 scroll-mt-24">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    🛡️
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                    Travel Insurance
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                  <p>
                    Travel insurance is essential for protecting yourself and your investment while traveling. We offer comprehensive travel insurance options that cover medical emergencies, trip cancellations, baggage loss, and other unforeseen circumstances.
                  </p>
                  <p>
                    Our travel insurance policies provide:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Medical emergency coverage</li>
                    <li>Trip cancellation and interruption protection</li>
                    <li>Baggage loss or delay coverage</li>
                    <li>Travel delay and missed connection coverage</li>
                    <li>24/7 emergency assistance</li>
                    <li>Coverage for adventure activities</li>
                  </ul>
                  <p>
                    Contact us to learn more about our travel insurance options and choose the plan that best suits your travel needs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Visa Assistance Section */}
          <section id="visa-assistance" className="mb-4 md:mb-6 scroll-mt-24">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    ✈️
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                    Visa Assistance
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                  <p>
                    Planning an international trip? We provide comprehensive visa assistance services to help make your travel documentation process smooth and hassle-free.
                  </p>
                  <p>
                    Our visa assistance services include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Visa application guidance and documentation support</li>
                    <li>Document verification and review</li>
                    <li>Visa application form filling assistance</li>
                    <li>Appointment scheduling for visa interviews</li>
                    <li>Information about visa requirements for different countries</li>
                    <li>Support throughout the entire visa application process</li>
                    <li>Follow-up on visa status and updates</li>
                  </ul>
                  <p>
                    We understand that visa applications can be complex and time-consuming. Our experienced team will guide you through each step, ensuring all necessary documents are prepared correctly and submitted on time.
                  </p>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-[#017233]/20 mt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Need Visa Assistance?</h3>
                    <p className="text-gray-700 mb-4">
                      Contact our visa assistance team today to get started with your visa application process.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href="tel:+918448801998"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-[#017233] to-[#01994d] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call Us: (+91) 8448801998
                      </a>
                      <a
                        href="mailto:info@safehandstravels.com"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#017233] font-semibold rounded-xl border-2 border-[#017233] hover:bg-green-50 transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email Us
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 24/7 Support Section */}
          <section id="support" className="mb-4 md:mb-6 scroll-mt-24">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    🆘
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                    24/7 Support
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                  <p>
                    We understand that travel needs can arise at any time, which is why we offer round-the-clock support to assist you whenever you need help.
                  </p>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-[#017233]/20">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Emergency Contact</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📞</span>
                        <a href="tel:+918448801998" className="text-lg font-semibold text-[#017233] hover:underline">
                          (+91) 8448801998
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">✉️</span>
                        <a href="mailto:info@safehandstravels.com" className="text-lg font-semibold text-[#017233] hover:underline break-all">
                          info@safehandstravels.com
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💬</span>
                        <a href="https://wa.me/918448801998" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-[#017233] hover:underline">
                          WhatsApp Support
                        </a>
                      </div>
                    </div>
                  </div>
                  <p>
                    Our support team is available 24 hours a day, 7 days a week to help you with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Booking assistance and modifications</li>
                    <li>Emergency support during your travels</li>
                    <li>Travel queries and information</li>
                    <li>Technical support for online bookings</li>
                    <li>Customer service inquiries</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Policies & Support Section */}
          <section id="policies" className="mb-4 md:mb-6 scroll-mt-24">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    📋
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                    Policies & Support
                  </h2>
                </div>

                {/* Cancellation & Refunds Policy */}
                <div id="cancellation" className="mb-6 scroll-mt-24">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Cancellation & Refunds Policy</h3>
                  <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                    <p>
                      We understand that sometimes plans change. Our cancellation policy is designed to be fair and transparent:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Cancellation 30+ days before departure:</strong> Full refund minus processing fees (5%)</li>
                      <li><strong>Cancellation 15-30 days before departure:</strong> 75% refund</li>
                      <li><strong>Cancellation 7-15 days before departure:</strong> 50% refund</li>
                      <li><strong>Cancellation less than 7 days before departure:</strong> No refund, but credit note issued for future travel</li>
                      <li><strong>No-show:</strong> No refund applicable</li>
                    </ul>
                    <p>
                      Refunds will be processed within 7-14 business days to the original payment method. Some bookings may have specific cancellation terms based on the service provider's policies.
                    </p>
                  </div>
                </div>

                {/* Privacy Policy */}
                <div id="privacy" className="mb-6 scroll-mt-24">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h3>
                  <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                    <p>
                      At Safe Hands Travels, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.
                    </p>
                    <p><strong>Information We Collect:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Personal details (name, email, phone number)</li>
                      <li>Travel preferences and requirements</li>
                      <li>Payment information (processed securely through encrypted gateways)</li>
                      <li>Website usage data and cookies</li>
                    </ul>
                    <p><strong>How We Use Your Information:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>To process bookings and provide travel services</li>
                      <li>To communicate about your bookings and respond to inquiries</li>
                      <li>To improve our services and website experience</li>
                      <li>To send promotional offers (with your consent)</li>
                    </ul>
                    <p>
                      We do not sell or share your personal information with third parties except as necessary to fulfill your bookings or as required by law. Your data is protected using industry-standard security measures.
                    </p>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div id="terms" className="mb-6 scroll-mt-24">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Terms & Conditions</h3>
                  <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                    <p>
                      By using our services, you agree to the following terms and conditions:
                    </p>
                    <p><strong>Booking Terms:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>All bookings are subject to availability</li>
                      <li>Prices are subject to change until booking is confirmed</li>
                      <li>Full payment may be required for certain bookings</li>
                      <li>Travel documents (passport, visas, etc.) are the traveler's responsibility</li>
                    </ul>
                    <p><strong>Travel Requirements:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Valid identification and travel documents required</li>
                      <li>Travel insurance is recommended</li>
                      <li>Health and safety guidelines must be followed</li>
                      <li>Travelers must comply with destination regulations</li>
                    </ul>
                    <p><strong>Liability:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>We act as an intermediary between travelers and service providers</li>
                      <li>We are not liable for delays, cancellations, or changes by third-party providers</li>
                      <li>Travelers are responsible for their own safety and belongings</li>
                      <li>Force majeure events may affect bookings without liability</li>
                    </ul>
                    <p>
                      For any disputes, the laws of India will apply, and disputes will be subject to the jurisdiction of Indian courts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section id="contact-form" className="scroll-mt-24">
            <ContactUsFormComponent />
          </section>
        </div>
      </div>
    </>
  )
}

export default ContactUs

