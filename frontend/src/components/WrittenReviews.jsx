import WrittenReviewCard from './card/WrittenReviewCard'

const writtenReviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: '2 weeks ago',
    title: 'Unforgettable Experience',
    review: 'This was hands down the best travel experience I have ever had. The attention to detail, knowledgeable guides, and stunning destinations made it absolutely perfect. I would highly recommend to anyone looking for an authentic travel experience.',
    location: 'Spiti Valley Trip',
    avatar: 'https://i.pravatar.cc/150?img=10'
  },
  {
    id: 2,
    name: 'Michael Chen',
    rating: 5,
    date: '1 month ago',
    title: 'Exceeded All Expectations',
    review: 'From the moment we booked until we returned home, everything was seamless. The team was professional, friendly, and went above and beyond to ensure we had an amazing time. The itinerary was well-planned and the destinations were breathtaking.',
    location: 'Ladakh Adventure',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: 3,
    name: 'Emily Davis',
    rating: 5,
    date: '3 weeks ago',
    title: 'Perfect Getaway',
    review: 'I cannot say enough good things about this trip. Every aspect was carefully thought out and executed. The accommodations were comfortable, the food was delicious, and the activities were exciting. I will definitely be booking another trip soon!',
    location: 'Meghalaya Tour',
    avatar: 'https://i.pravatar.cc/150?img=6'
  },
  {
    id: 4,
    name: 'David Wilson',
    rating: 5,
    date: '1 week ago',
    title: 'Best Travel Company',
    review: 'Outstanding service from start to finish. The guides were knowledgeable, the destinations were beautiful, and the overall experience was incredible. This company truly understands what makes a great travel experience and delivers it flawlessly.',
    location: 'Kerala Backwaters',
    avatar: 'https://i.pravatar.cc/150?img=14'
  }
]

function WrittenReviews() {
  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 lg:p-12">
            {/* Header Card */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  ✍️
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Written Reviews
                </h2>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {writtenReviews.map((review) => (
                <WrittenReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                className="bg-gradient-to-br from-[#017233] to-[#01994d] text-white px-8 py-3 rounded-xl font-bold text-base hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                View All Reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WrittenReviews

