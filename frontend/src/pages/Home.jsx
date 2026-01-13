import { useSearchParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import HeroVideo from '../components/HeroVideo'
import UpcomingTrips from '../components/UpcomingTrips'
import ExploreDestinations from '../components/ExploreDestinations'
import BannerSlider from '../components/BannerSlider'
import BrandingPartners from '../components/BrandingPartners'
import CertificateLegal from '../components/CertificateLegal'
import VibeWithUs from '../components/VibeWithUs'
import HotelPartners from '../components/HotelPartners'
import Reviews from '../components/Reviews'
import WrittenReviews from '../components/WrittenReviews'
import FAQ from '../components/FAQ'
import ContactUs from '../components/ContactUs'
import SEO from '../components/SEO'
import { getOrganizationSchema, getWebsiteSchema } from '../utils/structuredData'

function Home() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const tripsSectionRef = useRef(null)

  // Scroll to trips section when search is performed
  useEffect(() => {
    if (searchQuery.trim() && tripsSectionRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        const element = tripsSectionRef.current
        if (element) {
          // Get navbar height (sticky navbar at top)
          const navbar = document.querySelector('nav')
          const navbarHeight = navbar ? navbar.offsetHeight : 100
          // Add extra padding for spacing
          const offset = navbarHeight + 20
          
          // Calculate position with offset
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
          const offsetPosition = elementPosition - offset
          
          // Smooth scroll to position with offset
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
    }
  }, [searchQuery])

  const structuredData = [
    getOrganizationSchema(),
    getWebsiteSchema()
  ];

  return (
    <>
      <SEO
        title="Safe Hands Travels - Your Trusted Travel Partner"
        description="Discover amazing travel experiences with Safe Hands Travels. Explore destinations across India, book adventure trips, spiritual journeys, Himalayan escapes, beach breaks, and wellness retreats. Your trusted travel partner for group tours, custom itineraries, and 24/7 support."
        keywords="travel, trips, destinations, adventure, tourism, India travel, travel agency, Varanasi travel, spiritual trips, Himalayan escapes, beach trips, wellness retreats, group travel, custom itineraries, safe hands travels"
        url="/"
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
        <HeroVideo />
        <div ref={tripsSectionRef}>
          <UpcomingTrips searchQuery={searchQuery} />
        </div>
        <ExploreDestinations />
        <BannerSlider />
        <BrandingPartners />
        <VibeWithUs />
        <HotelPartners />
        <Reviews />
        <WrittenReviews />
        <FAQ />
        <CertificateLegal />
        <ContactUs />
      </div>
    </>
  )
}

export default Home

