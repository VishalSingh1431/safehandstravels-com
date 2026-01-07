function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="/images/Logo.webp"
              alt="SafeHands Travels"
              className="h-16 w-auto object-contain"
              loading="lazy"
            />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Experiences
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl">
            Discover amazing travel experiences, stories, and insights from our journeys across India.
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Blog content coming soon...</p>
        </div>
      </div>
    </div>
  )
}

export default Blog


