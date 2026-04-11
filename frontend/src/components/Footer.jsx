import { Link } from 'react-router-dom'

function Footer() {

  return (
    <>
      <footer className="w-full bg-gradient-to-br from-[#017233] via-[#01994d] to-[#00C853] text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 relative z-10">
          {/* Top Section - 5 Columns on Desktop, Stacked on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8 md:gap-12">
            {/* COLUMN 1: Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Link to="/" className="flex-shrink-0 group">
                  <img
                    src="/images/Logo.webp"
                    alt="Safe Hands Travels"
                    className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </Link>

              </div>
              <p className="text-white/90 leading-relaxed text-sm">
                Your trusted domestic travel partner for unforgettable experiences across India.
              </p>
              <div className="flex gap-3 pt-2">
                <a
                  href="https://www.facebook.com/SafeHandsTravels?_rdr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 border border-white/30"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/safehandtravels/?igsh=MTczcmZld2Q5Z3ozag%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 border border-white/30"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@safehandstravels"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 border border-white/30"
                  aria-label="YouTube"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* COLUMN 2: Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white drop-shadow-md">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-white/90 hover:text-white transition-colors hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/all-india-trips" className="text-white/90 hover:text-white transition-colors hover:underline">
                    All India Tours
                  </Link>
                </li>
                <li>
                  <Link to="/experiences" className="text-white/90 hover:text-white transition-colors hover:underline">
                    Experiences
                  </Link>
                </li>
                <li>
                  <Link to="/customise-trip" className="text-white/90 hover:text-white transition-colors hover:underline">
                    Customise your Trip
                  </Link>
                </li>
                <li>
                  <Link to="/why-safehands-travels" className="text-white/90 hover:text-white transition-colors hover:underline">
                    Why SafeHands Travels
                  </Link>
                </li>
                <li>
                  <Link to="/contact-us#our-team" className="text-white/90 hover:text-white transition-colors hover:underline">
                    Our Team
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: Our Services */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white drop-shadow-md">Our Services</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/adventure-trips" className="text-white/90 hover:text-white transition-colors hover:underline">
                    Adventure Tours
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-white/90 hover:text-white transition-colors hover:underline">
                    Group Travel
                  </a>
                </li>
                <li>
                  <Link to="/customise-trip" className="text-white/90 hover:text-white transition-colors hover:underline">
                    Customized Itineraries
                  </Link>
                </li>
                <li>
                  <Link to="/contact-us#visa-assistance" className="text-white/90 hover:text-white transition-colors hover:underline">
                    Visa Assistance
                  </Link>
                </li>
                <li>
                  <Link to="/contact-us#travel-insurance" className="text-white/90 hover:text-white transition-colors hover:underline">
                    Travel Insurance
                  </Link>
                </li>
                <li>
                  <Link to="/contact-us#support" className="text-white/90 hover:text-white transition-colors hover:underline">
                    24/7 Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 4: Policies & Support */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white drop-shadow-md">Policies & Support</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/contact-us#policies" className="text-white/90 hover:text-white transition-colors hover:underline">
                    Policies & Support
                  </Link>
                </li>
                <li>
                  <Link to="/contact-us#cancellation" className="text-white/90 hover:text-white transition-colors hover:underline">
                    Cancellation & Refunds Policy
                  </Link>
                </li>
                <li>
                  <Link to="/contact-us#privacy" className="text-white/90 hover:text-white transition-colors hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/contact-us#terms" className="text-white/90 hover:text-white transition-colors hover:underline">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 5: Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white drop-shadow-md">Contact Us</h4>
              {/* Contact Details */}
              <div className="space-y-3 mb-6 text-white/90">
                <div className="flex items-start gap-3">
                  <span className="text-white mt-1 text-lg">📍</span>
                  <span className="text-sm">
                    Flat No- KCB0040205,<br />
                    Wish Town Klassic, Sector 134,<br />
                    Noida, Gautam Buddha Nagar,<br />
                    Uttar Pradesh, 201304
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white text-lg">📞</span>
                  <a href="tel:+918448801998" className="text-sm hover:text-white transition-colors">
                    (+91) 8448801998
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white text-lg">✉️</span>
                  <a href="mailto:info@safehandstravels.com" className="text-sm hover:text-white transition-colors">
                    info@safehandstravels.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <p className="text-white/90 text-xs sm:text-sm text-center sm:text-left">
                © 2026 Safe Hands Travels. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
                <Link to="/contact-us#privacy" className="text-white/90 hover:text-white transition-colors hover:underline">
                  Privacy Policy
                </Link>
                <Link to="/contact-us#terms" className="text-white/90 hover:text-white transition-colors hover:underline">
                  Terms of Service
                </Link>
                <Link to="/contact-us" className="text-white/90 hover:text-white transition-colors hover:underline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button with Zoom Effect */}
      <a
        href="https://wa.me/918448801998"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group"
        aria-label="Contact us on WhatsApp"
      >
        <div className="relative">
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-0 bg-[#25D366] rounded-full animate-pulse opacity-50"></div>

          {/* Main button with zoom effect */}
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.77.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>
        </div>
      </a>
    </>
  )
}

export default Footer
