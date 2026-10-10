import { useState, useEffect } from 'react'
import { tripsAPI } from '../config/api'
import TripCard from '../components/card/TripCard'
import { Loader2 } from 'lucide-react'

function HimalayanEscapes() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const response = await tripsAPI.getAllTrips()
      const himalayanTrips = (response.trips || []).filter(trip => {
        const isActive = trip.status === 'active'
        const categories = Array.isArray(trip.category) ? trip.category : (trip.category ? [trip.category] : [])
        const text = `${trip.title || ''} ${trip.location || ''}`.toLowerCase()
        return isActive && (
          categories.some(c => String(c).toLowerCase().includes('himalay')) ||
          text.includes('himalay') ||
          text.includes('spiti') ||
          text.includes('ladakh') ||
          text.includes('manali')
        )
      })
      setTrips(himalayanTrips)
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-[#017233]" />
          </div>
        ) : trips.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
            {trips.map((trip) => (
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
