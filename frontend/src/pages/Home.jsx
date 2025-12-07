import HeroVideo from '../components/HeroVideo'
import UpcomingTrips from '../components/UpcomingTrips'
import ExploreDestinations from '../components/ExploreDestinations'
import BannerSlider from '../components/BannerSlider'
import CertificateLegal from '../components/CertificateLegal'
import Reviews from '../components/Reviews'
import WrittenReviews from '../components/WrittenReviews'
import ContactUs from '../components/ContactUs'

function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <HeroVideo />
      <UpcomingTrips />
      <ExploreDestinations />
      <BannerSlider />
      <CertificateLegal />
      <Reviews />
      <WrittenReviews />
      <ContactUs />
    </div>
  )
}

export default Home

