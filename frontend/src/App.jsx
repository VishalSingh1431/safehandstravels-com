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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  )
}

export default App
