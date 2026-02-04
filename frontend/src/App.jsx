import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ToastProvider } from './contexts/ToastContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import LeadCaptureForm from './components/LeadCaptureForm'
import AdminRoute from './components/AdminRoute'
import './App.css'

// Lazy load all pages for code splitting - reduces initial bundle size
const Home = lazy(() => import('./pages/Home'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Profile = lazy(() => import('./pages/Profile'))
const CarBooking = lazy(() => import('./pages/CarBooking'))
const AllIndiaTrips = lazy(() => import('./pages/AllIndiaTrips'))
const PopularTrips = lazy(() => import('./pages/PopularTrips'))
const DestinationTrips = lazy(() => import('./pages/DestinationTrips'))
const SpiritualTrips = lazy(() => import('./pages/SpiritualTrips'))
const CulturalTrips = lazy(() => import('./pages/CulturalTrips'))
const HeritageTrips = lazy(() => import('./pages/HeritageTrips'))
const WellnessTrips = lazy(() => import('./pages/WellnessTrips'))
const WildlifeTrips = lazy(() => import('./pages/WildlifeTrips'))
const AdventureTrips = lazy(() => import('./pages/AdventureTrips'))
const HimalayanEscapes = lazy(() => import('./pages/HimalayanEscapes'))
const BeachIslandBreaks = lazy(() => import('./pages/BeachIslandBreaks'))
const WellnessRetreats = lazy(() => import('./pages/WellnessRetreats'))
const Blog = lazy(() => import('./pages/Blog'))
const Experiences = lazy(() => import('./pages/Experiences'))
const CustomiseTrip = lazy(() => import('./pages/CustomiseTrip'))
const CustomisedTrip = lazy(() => import('./pages/CustomisedTrip'))
const WhySafeHandsTravels = lazy(() => import('./pages/WhySafeHandsTravels'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const ContactUs = lazy(() => import('./pages/ContactUs'))

// Admin pages - lazy loaded separately (rarely accessed)
const AdminTrips = lazy(() => import('./pages/AdminTrips'))
const AdminCertificates = lazy(() => import('./pages/AdminCertificates'))
const AdminDestinations = lazy(() => import('./pages/AdminDestinations'))
const AdminReviews = lazy(() => import('./pages/AdminReviews'))
const AdminWrittenReviews = lazy(() => import('./pages/AdminWrittenReviews'))
const AdminEnquiries = lazy(() => import('./pages/AdminEnquiries'))
const AdminDrivers = lazy(() => import('./pages/AdminDrivers'))
const AdminPopularTrips = lazy(() => import('./pages/AdminPopularTrips'))
const AdminVibeVideos = lazy(() => import('./pages/AdminVibeVideos'))
const AdminTravellerReviews = lazy(() => import('./pages/AdminTravellerReviews'))
const AdminFAQs = lazy(() => import('./pages/AdminFAQs'))
const AdminBanners = lazy(() => import('./pages/AdminBanners'))
const AdminBrandingPartners = lazy(() => import('./pages/AdminBrandingPartners'))
const AdminHotelPartners = lazy(() => import('./pages/AdminHotelPartners'))
const AdminBlogs = lazy(() => import('./pages/AdminBlogs'))
const AdminTeam = lazy(() => import('./pages/AdminTeam'))

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#017233] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
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
              <Route path="/wellness-trips" element={<WellnessTrips />} />
              <Route path="/wildlife-trips" element={<WildlifeTrips />} />
              <Route path="/adventure-trips" element={<AdventureTrips />} />
              <Route path="/himalayan-escapes" element={<HimalayanEscapes />} />
              <Route path="/beach-island-breaks" element={<BeachIslandBreaks />} />
              <Route path="/wellness-retreats" element={<WellnessRetreats />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/customise-trip" element={<CustomisedTrip />} />
              <Route path="/why-safehands-travels" element={<WhySafeHandsTravels />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/blog/destination/:id" element={<BlogDetail />} />
              {/* Admin Routes - protected: redirect to login if not authenticated */}
              <Route path="/admin/trips" element={<AdminRoute><AdminTrips /></AdminRoute>} />
              <Route path="/admin/certificates" element={<AdminRoute><AdminCertificates /></AdminRoute>} />
              <Route path="/admin/destinations" element={<AdminRoute><AdminDestinations /></AdminRoute>} />
              <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
              <Route path="/admin/written-reviews" element={<AdminRoute><AdminWrittenReviews /></AdminRoute>} />
              <Route path="/admin/enquiries" element={<AdminRoute><AdminEnquiries /></AdminRoute>} />
              <Route path="/admin/drivers" element={<AdminRoute><AdminDrivers /></AdminRoute>} />
              <Route path="/admin/popular-trips" element={<AdminRoute><AdminPopularTrips /></AdminRoute>} />
              <Route path="/admin/vibe-videos" element={<AdminRoute><AdminVibeVideos /></AdminRoute>} />
              <Route path="/admin/traveller-reviews" element={<AdminRoute><AdminTravellerReviews /></AdminRoute>} />
              <Route path="/admin/faqs" element={<AdminRoute><AdminFAQs /></AdminRoute>} />
              <Route path="/admin/banners" element={<AdminRoute><AdminBanners /></AdminRoute>} />
              <Route path="/admin/branding-partners" element={<AdminRoute><AdminBrandingPartners /></AdminRoute>} />
              <Route path="/admin/hotel-partners" element={<AdminRoute><AdminHotelPartners /></AdminRoute>} />
              <Route path="/admin/blogs" element={<AdminRoute><AdminBlogs /></AdminRoute>} />
              <Route path="/admin/team" element={<AdminRoute><AdminTeam /></AdminRoute>} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <LeadCaptureForm />
        </div>
      </Router>
    </ToastProvider>
  )
}

export default App
