import { useState, useEffect } from 'react'
import ReviewCard from './card/ReviewCard'
import { reviewsAPI } from '../config/api'

function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await reviewsAPI.getAllReviews()
      setReviews(response.reviews || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return (
      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-4 md:py-6">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 lg:p-12">
              <div className="text-center py-6">
                <p className="text-gray-600">Loading reviews...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-4 md:py-6">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 lg:p-12">
            {/* Header Card */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  ⭐
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Traveller Reviews
                </h2>
              </div>
            </div>

            {/* Horizontal Scrolling Row - All Screen Sizes */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-4 md:gap-6 min-w-max">
                {reviews.map((review) => (
                  <div key={review.id} className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px] lg:w-[380px]">
                    <ReviewCard review={review} />
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

export default Reviews

