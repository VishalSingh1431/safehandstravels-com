import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { tripsAPI, locationFiltersAPI } from '../config/api'
import TripCard from './card/TripCard'
import { Loader2 } from 'lucide-react'

function UpcomingTrips({ searchQuery = '' }) {
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
  }, [searchQuery])

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
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-4 md:py-6">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div>
            {/* Header Card */}
            <div className="p-4 md:p-5 lg:p-6 pb-0 mb-6">
              <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    ✈️
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                    {searchQuery.trim() ? `Search Results for "${searchQuery}"` : 'Popular Trips'}
                  </h2>
                </div>
                <Link
                  to="/popular-trips"
                  className="rounded-full border-2 border-[#017233] bg-white text-[#017233] px-6 py-2 text-sm font-semibold transition-all duration-300 whitespace-nowrap hover:bg-[#017233] hover:text-white shadow-md hover:shadow-lg"
                >
                  See All
                </Link>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap items-center gap-3">
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
            </div>

            {/* Trips Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="w-8 h-8 animate-spin text-[#017233]" />
              </div>
            ) : visibleTrips.length > 0 ? (
              <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch p-4 md:p-5 lg:p-6">
                {visibleTrips.slice(0, 16).map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <div className="p-8 md:p-12 text-center">
                <p className="text-gray-500 text-lg">
                  {searchQuery.trim() 
                    ? `No trips found matching "${searchQuery}"` 
                    : 'No trips available at the moment.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default UpcomingTrips

