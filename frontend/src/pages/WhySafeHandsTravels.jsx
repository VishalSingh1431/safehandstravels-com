import { Shield, Map, Headphones, Star, DollarSign, Users } from 'lucide-react'
import SEO from '../components/SEO'

function WhySafeHandsTravels() {
  const features = [
    {
      icon: Shield,
      title: 'Trusted & Safe Travel Experiences',
      description: 'Your safety and security are our top priorities. We ensure every journey is carefully planned and monitored for your peace of mind.'
    },
    {
      icon: Map,
      title: '100% Domestic Trip Expertise',
      description: 'Specialized knowledge of India\'s hidden gems and popular destinations, crafted by local experts who know the land intimately.'
    },
    {
      icon: Headphones,
      title: '24/7 Travel Support',
      description: 'Round-the-clock assistance whenever you need it. Our dedicated support team is always ready to help you during your travels.'
    },
    {
      icon: Star,
      title: 'Verified Reviews & Happy Travelers',
      description: 'Join thousands of satisfied travelers who have experienced unforgettable journeys with us. Real reviews from real travelers.'
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing (No Hidden Costs)',
      description: 'What you see is what you pay. No surprises, no hidden fees. Complete transparency in all our pricing and packages.'
    },
    {
      icon: Users,
      title: 'Customized Travel Plans',
      description: 'Every traveler is unique. We create personalized itineraries tailored to your preferences, budget, and travel style.'
    }
  ]

  return (
    <>
      <SEO
        title="Why SafeHands Travels | Your Trusted Travel Partner"
        description="Discover why SafeHands Travels is your trusted travel partner. Experience safe, customized, and memorable journeys across India with transparent pricing and 24/7 support."
        keywords="why safehands travels, trusted travel agency, safe travel, domestic trips, travel support, transparent pricing, customized travel plans"
        url="/why-safehands-travels"
      />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 font-sans">
        {/* Section Header */}
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="mx-auto w-full max-w-6xl px-2 sm:px-3 lg:px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
                Why SafeHand Travels
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Your trusted partner for safe, memorable, and extraordinary travel experiences across India. 
                We combine expertise, transparency, and dedicated support to make every journey unforgettable.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="mx-auto w-full max-w-7xl px-2 sm:px-3 lg:px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div
                    key={index}
                    className="group relative bg-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] border border-gray-100"
                  >
                    {/* Icon */}
                    <div className="mb-4 md:mb-6 flex justify-center">
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl group-hover:from-green-100 group-hover:to-emerald-100 transition-all duration-300">
                        <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-[#017233] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 text-center group-hover:text-[#017233] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed text-center">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default WhySafeHandsTravels

