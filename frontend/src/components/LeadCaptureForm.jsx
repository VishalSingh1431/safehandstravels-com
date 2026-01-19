import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plane } from 'lucide-react'
import { enquiriesAPI } from '../config/api'
import { useToast } from '../contexts/ToastContext'

const LeadCaptureForm = () => {
  const toast = useToast()
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  // Function to manually open the form (for trigger button)
  const openForm = () => {
    setIsVisible(true)
  }

  // Check if form has been shown or submitted before in this session
  useEffect(() => {
    const shown = sessionStorage.getItem('leadFormShown')
    const submitted = sessionStorage.getItem('leadFormSubmitted')
    
    if (shown === 'true' || submitted === 'true') {
      return // Don't show if already shown or submitted in this session
    }

    let timeTrigger = null
    let hasTriggered = false

    const showForm = () => {
      if (!hasTriggered && !hasShown) {
        hasTriggered = true
        setIsVisible(true)
        setHasShown(true)
        sessionStorage.setItem('leadFormShown', 'true')
        
        // Clean up
        if (timeTrigger) clearTimeout(timeTrigger)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    // Time-based trigger (4-8 seconds)
    timeTrigger = setTimeout(showForm, Math.random() * 4000 + 4000) // Random between 4-8 seconds

    // Scroll-based trigger (35% scroll)
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      
      if (scrollPercent >= 35) {
        showForm()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (timeTrigger) clearTimeout(timeTrigger)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasShown])

  const handleClose = () => {
    setIsVisible(false)
    // Mark as shown in session so it won't appear again in this session
    // But will show again on page refresh (new session)
    sessionStorage.setItem('leadFormShown', 'true')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Format phone number (only digits)
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '')
      // Limit to 10 digits
      if (digitsOnly.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: digitsOnly }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.phone.trim() || formData.phone.length !== 10) {
      toast.error('Please enter a valid name and 10-digit phone number')
      return
    }

    setIsSubmitting(true)

    try {
      // Use enquiries API - email is required, so we'll use a placeholder
      // In production, you might want to create a separate leads endpoint
      await enquiriesAPI.createEnquiry({
        name: formData.name.trim(),
        email: `lead+${Date.now()}@safehandstravels.com`, // Placeholder email
        phone: `+91${formData.phone}`,
        message: 'Lead captured from lead capture form - interested in trip planning consultation',
      })

      // Mark as submitted so it won't show again in this session
      // Will show again on page refresh (new session)
      sessionStorage.setItem('leadFormSubmitted', 'true')
      setIsVisible(false)
      
      toast.success('Thank you! Our travel expert will connect with you soon.')
    } catch (error) {
      console.error('Error submitting lead:', error)
      toast.error(error.message || 'Failed to submit. Please try again later.')
      // Even on error, mark as shown to prevent repeated popups in this session
      sessionStorage.setItem('leadFormShown', 'true')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Fixed "Plan a Trip" Trigger Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        onClick={openForm}
        className="fixed right-4 bottom-24 sm:right-6 sm:bottom-28 md:bottom-32 z-50 group"
        aria-label="Plan a trip"
      >
        <div className="relative">
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#017233] to-[#00C853] rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
          
          {/* Main button */}
          <div className="relative bg-gradient-to-br from-[#017233] via-[#01994d] to-[#00C853] text-white rounded-full px-5 py-3 sm:px-6 sm:py-3.5 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 sm:gap-3">
            <Plane className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
            <span className="font-semibold text-sm sm:text-base whitespace-nowrap">
              Plan a Trip
            </span>
          </div>
        </div>
      </motion.button>

      {/* Popup Form */}
      <AnimatePresence>
        {isVisible && (
        <>
          {/* Backdrop with subtle blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[9998]"
            onClick={handleClose}
          />

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              duration: 0.4 
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative gradient accent at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#017233] via-[#01994d] to-[#00C853]"></div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 z-10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-8 sm:p-10">
                {/* Travel icon badge */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#017233]/10 to-[#00C853]/10 flex items-center justify-center">
                    <Plane className="w-8 h-8 text-[#017233]" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
                  Plan Your Trip with SafeHands
                </h2>

                {/* Subtitle */}
                <p className="text-gray-600 text-center text-sm sm:text-base mb-6 leading-relaxed">
                  Share a few details and our expert will connect with you
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="lead-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="lead-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233]/20 focus:border-[#017233] transition-all outline-none text-gray-900 placeholder-gray-400"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label htmlFor="lead-phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        +91
                      </div>
                      <input
                        type="tel"
                        id="lead-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        minLength={10}
                        maxLength={10}
                        className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017233]/20 focus:border-[#017233] transition-all outline-none text-gray-900 placeholder-gray-400"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name.trim() || formData.phone.length !== 10}
                    className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-[#017233] via-[#01994d] to-[#00C853] text-white font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Talk to a Travel Expert'
                    )}
                  </button>

                  {/* Trust hint */}
                  <p className="text-xs text-gray-500 text-center mt-4">
                    No spam. Only genuine travel assistance.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </>
  )
}

export default LeadCaptureForm

