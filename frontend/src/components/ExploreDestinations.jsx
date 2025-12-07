import DestinationCard from './card/DestinationCard'

const destinations = [
  {
    id: 1,
    name: 'Spiti Valley',
    image: 'https://images.unsplash.com/photo-1523906630133-f6934a1ab6c8?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 2,
    name: 'Meghalaya',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 3,
    name: 'Tawang',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 4,
    name: 'Ladakh',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73bb2?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 5,
    name: 'Manali',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 6,
    name: 'Andaman',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 7,
    name: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73bb2?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 8,
    name: 'Goa',
    image: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 9,
    name: 'Kerala',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 10,
    name: 'Himachal',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=60'
  }
]

function ExploreDestinations() {
  // Duplicate destinations for seamless infinite scroll
  const duplicatedDestinations = [...destinations, ...destinations]

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 overflow-x-hidden overflow-y-visible">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              🌍
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Explore Destinations
            </h2>
          </div>
        </div>

        {/* Scrolling Marquee Container */}
        <div className="relative py-8">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-gray-50/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-gray-50/80 to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrolling Content */}
          <div className="overflow-x-hidden overflow-y-visible">
            <div className="flex gap-6 md:gap-8 animate-scroll py-4">
              {duplicatedDestinations.map((destination, index) => (
                <div key={`${destination.id}-${index}`} className="flex-shrink-0 px-2">
                  <DestinationCard destination={destination} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExploreDestinations

