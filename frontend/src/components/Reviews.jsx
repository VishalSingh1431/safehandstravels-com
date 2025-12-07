import ReviewCard from './card/ReviewCard'

const reviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    rating: 5,
    location: 'Spiti Valley Trip',
    review: 'Amazing experience! The guides were knowledgeable and the itinerary was perfect.',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    name: 'Rahul Kumar',
    rating: 5,
    location: 'Ladakh Adventure',
    review: 'Best trip of my life! Highly recommend this travel company.',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 3,
    name: 'Anjali Patel',
    rating: 5,
    location: 'Meghalaya Tour',
    review: 'Exceeded expectations in every way. Beautiful destinations and great service.',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 4,
    name: 'Vikram Singh',
    rating: 5,
    location: 'Manali Escape',
    review: 'Professional team and well-organized trips. Will book again!',
    avatar: 'https://i.pravatar.cc/150?img=8'
  },
  {
    id: 5,
    name: 'Sneha Reddy',
    rating: 5,
    location: 'Kerala Backwaters',
    review: 'Fantastic experience from start to finish. Highly satisfied!',
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  {
    id: 6,
    name: 'Arjun Mehta',
    rating: 5,
    location: 'Himachal Pradesh',
    review: 'Wonderful memories created. The trip was worth every penny!',
    avatar: 'https://i.pravatar.cc/150?img=13'
  }
]

function Reviews() {
  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 lg:p-12">
            {/* Header Card */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  ⭐
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Traveller Reviews
                </h2>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* See All Button */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                className="bg-gradient-to-br from-[#017233] to-[#01994d] text-white px-8 py-3 rounded-xl font-bold text-base hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                See All Reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Reviews

