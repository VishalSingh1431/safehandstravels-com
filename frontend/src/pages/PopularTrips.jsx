import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { tripsAPI, locationFiltersAPI } from '../config/api'
import TripCard from '../components/card/TripCard'
import { Loader2 } from 'lucide-react'

function PopularTrips() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const [activeFilter, setActiveFilter] = useState('All')
  const [trips, setTrips] = useState([])
  const [filters, setFilters] = useState(['All'])
  const [loading, setLoading] = useState(true)
  const [loadingFilters, setLoadingFilters] = useState(true)

  useEffect(() => {
    fetchTrips()
    fetchFilters()
  }, [])

  // Update filter when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      // Try to match search query with a filter
      const matchedFilter = filters.find(filter => 
        filter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        searchQuery.toLowerCase().includes(filter.toLowerCase())
      )
      if (matchedFilter && matchedFilter !== 'All') {
        setActiveFilter(matchedFilter)
      }
    }
  }, [searchQuery, filters])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const response = await tripsAPI.getAllTrips()
      // Filter only active trips that are marked as popular
      const popularTrips = (response.trips || []).filter(trip => 
        trip.status === 'active' && trip.isPopular === true
      )
      setTrips(popularTrips)
    } catch (error) {
      console.error('Error fetching trips:', error)
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      setLoadingFilters(true)
      const response = await locationFiltersAPI.getLocationFilters()
      setFilters(response.filters || ['All'])
    } catch (error) {
      console.error('Error fetching filters:', error)
      // Fallback to default filters
      setFilters(['All', 'Meghalaya', 'Spiti Valley', 'Tirthan Valley', 'Himachal Pradesh', 'Shimla', 'Varanasi', 'Rishikesh', 'Kerala Backwaters'])
    } finally {
      setLoadingFilters(false)
    }
  }

  const visibleTrips = useMemo(() => {
    let filtered = trips

    // Apply location filter (case-insensitive, partial match)
    if (activeFilter !== 'All') {
      filtered = filtered.filter((trip) => {
        const tripLocation = (trip.location || '').toLowerCase().trim()
        const filterLocation = activeFilter.toLowerCase().trim()
        return tripLocation === filterLocation || tripLocation.includes(filterLocation)
      })
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((trip) => 
        trip.title?.toLowerCase().includes(query) ||
        trip.location?.toLowerCase().includes(query) ||
        trip.subtitle?.toLowerCase().includes(query) ||
        trip.intro?.toLowerCase().includes(query)
      )
    }

    // Sort trips: Popular trips first (by isPopular), then by price (low to high)
    filtered.sort((a, b) => {
      // First sort by popularity (popular first)
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1
      
      // Then sort by price (extract numeric value for comparison)
      const priceA = parseFloat((a.price || '0').replace(/[₹,]/g, '')) || 0
      const priceB = parseFloat((b.price || '0').replace(/[₹,]/g, '')) || 0
      return priceA - priceB
    })

    return filtered
  }, [activeFilter, trips, searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              ✈️
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              {searchQuery.trim() ? `Search Results for "${searchQuery}"` : 'Popular Trips'}
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl">
            Discover our most popular and highly-rated trips across India. 
            These handpicked experiences are loved by travelers and come highly recommended.
          </p>
        </div>

        {/* Filter Buttons */}
        {!loadingFilters && (
          <div className="mb-8 flex flex-wrap items-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap shadow-md hover:shadow-lg ${
                  activeFilter === filter
                    ? 'border-[#017233] bg-gradient-to-br from-[#017233] to-[#01994d] text-white shadow-lg'
                    : 'border-gray-200 text-gray-700 hover:border-[#017233] hover:text-[#017233] bg-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        {/* Trips Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-[#017233]" />
          </div>
        ) : visibleTrips.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
            {visibleTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery.trim() 
                ? `No trips found matching "${searchQuery}"` 
                : activeFilter !== 'All'
                ? `No trips found for ${activeFilter}`
                : 'No popular trips available at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PopularTrips

