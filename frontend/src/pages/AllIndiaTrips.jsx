import { useMemo } from 'react'
import { trips } from '../data/trips'
import TripCard from '../components/card/TripCard'

function AllIndiaTrips() {
  const allTrips = useMemo(() => trips, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              🗺️
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              All India Trips
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl">
            Explore the diverse beauty of India with our curated collection of trips across the country. 
            From the mountains of the north to the beaches of the south, discover incredible destinations.
          </p>
        </div>

        {/* Trips Grid */}
        {allTrips.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
            {allTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No trips available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllIndiaTrips

