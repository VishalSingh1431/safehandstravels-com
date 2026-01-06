import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { tripsAPI } from '../config/api'
import TripCard from '../components/card/TripCard'
import { Loader2 } from 'lucide-react'

function DestinationTrips() {
  const { destinationName } = useParams()
  const decodedDestinationName = decodeURIComponent(destinationName || '')
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrips()
  }, [decodedDestinationName])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const response = await tripsAPI.getAllTrips()
      // Filter active trips where location contains the destination name (case-insensitive)
      const destinationTrips = (response.trips || []).filter(trip => {
        if (trip.status !== 'active') return false
        const tripLocation = (trip.location || '').toLowerCase().trim()
        const destination = decodedDestinationName.toLowerCase().trim()
        return tripLocation.includes(destination) || destination.includes(tripLocation)
      })
      
      // Sort trips: Popular first, then by price (low to high)
      destinationTrips.sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1
        if (!a.isPopular && b.isPopular) return 1
        const priceA = parseFloat((a.price || '0').replace(/[₹,]/g, '')) || 0
        const priceB = parseFloat((b.price || '0').replace(/[₹,]/g, '')) || 0
        return priceA - priceB
      })
      
      setTrips(destinationTrips)
    } catch (error) {
      console.error('Error fetching trips:', error)
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              🌍
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              {decodedDestinationName} Trips
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl">
            Discover amazing trips and experiences in {decodedDestinationName}. 
            Explore curated travel packages and create unforgettable memories.
          </p>
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-[#017233]" />
          </div>
        ) : trips.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Found {trips.length} {trips.length === 1 ? 'trip' : 'trips'} in {decodedDestinationName}
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No trips available for {decodedDestinationName} at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DestinationTrips

