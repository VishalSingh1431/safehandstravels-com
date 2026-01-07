import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import CarBooking from './pages/CarBooking'
import AllIndiaTrips from './pages/AllIndiaTrips'
import SpiritualTrips from './pages/SpiritualTrips'
import HimalayanEscapes from './pages/HimalayanEscapes'
import BeachIslandBreaks from './pages/BeachIslandBreaks'
import WellnessRetreats from './pages/WellnessRetreats'
import Experiences from './pages/Experiences'
import CustomisedTrip from './pages/CustomisedTrip'
import WhySafeHandsTravels from './pages/WhySafeHandsTravels'
import BlogDetail from './pages/BlogDetail'
import AdminTrips from './pages/AdminTrips'
import AdminCertificates from './pages/AdminCertificates'
import AdminDestinations from './pages/AdminDestinations'
import AdminReviews from './pages/AdminReviews'
import AdminWrittenReviews from './pages/AdminWrittenReviews'
import AdminEnquiries from './pages/AdminEnquiries'
import AdminProductPageSettings from './pages/AdminProductPageSettings'
import AdminDrivers from './pages/AdminDrivers'
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
              <Route path="/spiritual-trips" element={<SpiritualTrips />} />
              <Route path="/himalayan-escapes" element={<HimalayanEscapes />} />
              <Route path="/beach-island-breaks" element={<BeachIslandBreaks />} />
              <Route path="/wellness-retreats" element={<WellnessRetreats />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/customise-trip" element={<CustomisedTrip />} />
              <Route path="/why-safehands-travels" element={<WhySafeHandsTravels />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/blog/destination/:id" element={<BlogDetail />} />
              {/* Admin Routes */}
              <Route path="/admin/trips" element={<AdminTrips />} />
              <Route path="/admin/certificates" element={<AdminCertificates />} />
              <Route path="/admin/destinations" element={<AdminDestinations />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/admin/written-reviews" element={<AdminWrittenReviews />} />
              <Route path="/admin/enquiries" element={<AdminEnquiries />} />
              <Route path="/admin/product-page-settings" element={<AdminProductPageSettings />} />
              <Route path="/admin/drivers" element={<AdminDrivers />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  )
}

export default App
