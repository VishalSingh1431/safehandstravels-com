import { useMemo } from 'react'
import { getTripsByCategory } from '../data/trips'
import TripCard from '../components/card/TripCard'

function HimalayanEscapes() {
  const himalayanTrips = useMemo(() => getTripsByCategory('himalayan'), [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              ⛰️
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Himalayan Escapes
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl">
            Experience the majestic beauty of the Himalayas. From snow-capped peaks to serene valleys, 
            discover adventure and tranquility in the lap of these magnificent mountains.
          </p>
        </div>

        {/* Trips Grid */}
        {himalayanTrips.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
            {himalayanTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No Himalayan trips available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HimalayanEscapes

