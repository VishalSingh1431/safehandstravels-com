import { useState, useEffect } from 'react'
import { tripsAPI } from '../config/api'
import TripCard from '../components/card/TripCard'
import { Loader2 } from 'lucide-react'

function AllIndiaTrips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleTrips, setVisibleTrips] = useState(50)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const response = await tripsAPI.getAllTrips()
      // Show all active trips regardless of category
      const allActiveTrips = (response.trips || []).filter(trip => trip.status === 'active')
      setTrips(allActiveTrips)
    } catch (error) {
      console.error('Error fetching trips:', error)
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-[#017233]" />
          </div>
        ) : trips.length > 0 ? (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
              {trips.slice(0, visibleTrips).map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
            {trips.length > visibleTrips && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleTrips(prev => prev + 50)}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#017233] to-emerald-600 hover:from-[#015a28] hover:to-[#017233] text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  Load More Trips
                </button>
              </div>
            )}
          </>
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

