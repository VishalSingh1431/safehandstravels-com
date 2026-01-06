import { useState, useEffect } from 'react'
import { faqsAPI } from '../config/api'
import { Loader2 } from 'lucide-react'

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      setLoading(true)
      const response = await faqsAPI.getAllFAQs()
      // Sort by display order
      const sortedFAQs = (response.faqs || []).sort((a, b) => {
        const orderA = a.displayOrder || 0
        const orderB = b.displayOrder || 0
        if (orderA !== orderB) return orderA - orderB
        return a.id - b.id
      })
      setFaqs(sortedFAQs)
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      setFaqs([])
    } finally {
      setLoading(false)
    }
  }

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  ❓
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl">
                Find answers to common questions about our travel services, booking process, and policies.
              </p>
            </div>

            {/* FAQ Items */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#017233]" />
              </div>
            ) : faqs.length > 0 ? (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
            <div
              key={faq.id || index}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between text-left focus:outline-none transition-all"
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-6 h-6 text-[#017233] transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 md:px-8 md:pb-6 pt-0">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No FAQs available at the moment.</p>
              </div>
            )}

            {/* Additional Help */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                Still have questions? We're here to help!
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#017233] to-[#01994d] text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Contact Us
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ

