import { useState, useEffect } from 'react'
import WrittenReviewCard from './card/WrittenReviewCard'
import { writtenReviewsAPI } from '../config/api'

function WrittenReviews() {
  const [writtenReviews, setWrittenReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWrittenReviews()
  }, [])

  const fetchWrittenReviews = async () => {
    try {
      setLoading(true)
      const response = await writtenReviewsAPI.getAllWrittenReviews()
      setWrittenReviews(response.writtenReviews || [])
    } catch (error) {
      console.error('Error fetching written reviews:', error)
      setWrittenReviews([])
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return (
      <section className="w-full bg-gradient-to-b from-white to-gray-50 py-4 md:py-6">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 lg:p-12">
              <div className="text-center py-6">
                <p className="text-gray-600">Loading written reviews...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (writtenReviews.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-4 md:py-6">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 lg:p-12">
            {/* Header Card */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  ✍️
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Written Reviews
                </h2>
              </div>
            </div>

            {/* Horizontal Scrolling Row - All Screen Sizes */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-3 sm:gap-4 md:gap-5 min-w-max">
                {writtenReviews.map((review) => (
                  <div key={review.id} className="flex-shrink-0 w-[240px] xs:w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px]">
                    <WrittenReviewCard review={review} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WrittenReviews

