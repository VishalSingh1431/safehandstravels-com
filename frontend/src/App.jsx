import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import CarBooking from './pages/CarBooking'
import AllIndiaTrips from './pages/AllIndiaTrips'
import PopularTrips from './pages/PopularTrips'
import DestinationTrips from './pages/DestinationTrips'
import SpiritualTrips from './pages/SpiritualTrips'
import CulturalTrips from './pages/CulturalTrips'
import HeritageTrips from './pages/HeritageTrips'
import NatureTrips from './pages/NatureTrips'
import AdventureTrips from './pages/AdventureTrips'
import HimalayanEscapes from './pages/HimalayanEscapes'
import BeachIslandBreaks from './pages/BeachIslandBreaks'
import WellnessRetreats from './pages/WellnessRetreats'
import Blog from './pages/Blog'
import CustomiseTrip from './pages/CustomiseTrip'
import WhySafeHandsTravels from './pages/WhySafeHandsTravels'
import AdminTrips from './pages/AdminTrips'
import AdminCertificates from './pages/AdminCertificates'
import AdminDestinations from './pages/AdminDestinations'
import AdminReviews from './pages/AdminReviews'
import AdminWrittenReviews from './pages/AdminWrittenReviews'
import AdminEnquiries from './pages/AdminEnquiries'
import AdminDrivers from './pages/AdminDrivers'
import AdminPopularTrips from './pages/AdminPopularTrips'
import AdminVibeVideos from './pages/AdminVibeVideos'
import AdminTravellerReviews from './pages/AdminTravellerReviews'
import AdminFAQs from './pages/AdminFAQs'
import AdminBanners from './pages/AdminBanners'
import AdminBrandingPartners from './pages/AdminBrandingPartners'
import AdminHotelPartners from './pages/AdminHotelPartners'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/trip/:id" element={<ProductPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/car-rentals" element={<CarBooking />} />
              <Route path="/all-india-trips" element={<AllIndiaTrips />} />
              <Route path="/popular-trips" element={<PopularTrips />} />
              <Route path="/destination/:destinationName" element={<DestinationTrips />} />
              <Route path="/spiritual-trips" element={<SpiritualTrips />} />
              <Route path="/cultural-trips" element={<CulturalTrips />} />
              <Route path="/heritage-trips" element={<HeritageTrips />} />
              <Route path="/nature-trips" element={<NatureTrips />} />
              <Route path="/adventure-trips" element={<AdventureTrips />} />
              <Route path="/himalayan-escapes" element={<HimalayanEscapes />} />
              <Route path="/beach-island-breaks" element={<BeachIslandBreaks />} />
              <Route path="/wellness-retreats" element={<WellnessRetreats />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/experiences" element={<Blog />} />
              <Route path="/customise-trip" element={<CustomiseTrip />} />
              <Route path="/why-safehands-travels" element={<WhySafeHandsTravels />} />
              {/* Admin Routes */}
              <Route path="/admin/trips" element={<AdminTrips />} />
              <Route path="/admin/certificates" element={<AdminCertificates />} />
              <Route path="/admin/destinations" element={<AdminDestinations />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/admin/written-reviews" element={<AdminWrittenReviews />} />
              <Route path="/admin/enquiries" element={<AdminEnquiries />} />
              <Route path="/admin/drivers" element={<AdminDrivers />} />
              <Route path="/admin/popular-trips" element={<AdminPopularTrips />} />
              <Route path="/admin/vibe-videos" element={<AdminVibeVideos />} />
              <Route path="/admin/traveller-reviews" element={<AdminTravellerReviews />} />
              <Route path="/admin/faqs" element={<AdminFAQs />} />
              <Route path="/admin/banners" element={<AdminBanners />} />
              <Route path="/admin/branding-partners" element={<AdminBrandingPartners />} />
              <Route path="/admin/hotel-partners" element={<AdminHotelPartners />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  )
}

export default App
