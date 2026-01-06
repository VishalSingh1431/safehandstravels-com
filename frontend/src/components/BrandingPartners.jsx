import { useState } from 'react'

// SVG Logo Components - Real brand logos
const GoogleLogo = () => (
  <svg width="120" height="40" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path fill="#4285F4" d="M115.75 47.18c0 12.77-10.47 23.18-23.18 23.18s-23.18-10.41-23.18-23.18C69.39 34.32 79.86 24 92.57 24s23.18 10.32 23.18 23.18zm-9.74 0c0-7.98-5.79-14.67-13.44-14.67s-13.44 6.69-13.44 14.67c0 8.26 5.79 14.67 13.44 14.67s13.44-6.41 13.44-14.67z"/>
      <path fill="#EA4335" d="M163.75 47.18c0 12.77-10.47 23.18-23.18 23.18s-23.18-10.41-23.18-23.18c0-12.85 10.47-23.18 23.18-23.18s23.18 10.32 23.18 23.18zm-9.74 0c0-7.98-5.79-14.67-13.44-14.67s-13.44 6.69-13.44 14.67c0 8.26 5.79 14.67 13.44 14.67s13.44-6.41 13.44-14.67z"/>
      <path fill="#FBBC05" d="M209.75 26.34v39.82c0 16.38-9.66 23.18-22.65 23.18-12.21 0-20.93-7.4-24.03-14.11l9.74-6.31c2.02 5.2 6.76 8.97 14.29 8.97 8.71 0 14.29-5.2 14.29-13.44v-3.19h-.34c-2.36 2.19-6.76 3.7-11.65 3.7-12.21 0-22.65-9.66-22.65-22.65 0-13.44 10.44-22.65 22.65-22.65 4.89 0 9.29 1.52 11.65 3.7h.34v-3.19h9.74zm-9.74 20.15c0 7.98-5.79 13.44-13.44 13.44s-13.44-5.46-13.44-13.44c0-7.98 5.79-13.44 13.44-13.44s13.44 5.46 13.44 13.44z"/>
      <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
      <path fill="#EA4335" d="M262.02 75.23c-1.69 0-3.02-.84-3.02-2.52 0-1.68 1.35-2.52 3.02-2.52 1.68 0 3.02.84 3.02 2.52 0 1.68-1.35 2.52-3.02 2.52zm-3.02-4.2h6.04v-25.9h-6.04v25.9z"/>
    </g>
  </svg>
)

const AmazonLogo = () => (
  <svg width="120" height="40" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="38" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="normal" fill="#232F3E">amazon</text>
    <path d="M10 20 Q30 15 50 20 T90 20" stroke="#FF9900" strokeWidth="3" fill="none"/>
    <path d="M10 40 Q30 35 50 40 T90 40" stroke="#FF9900" strokeWidth="3" fill="none"/>
  </svg>
)

const FlipkartLogo = () => (
  <svg width="120" height="40" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="60" rx="4" fill="#2874F0"/>
    <text x="20" y="38" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white">Flipkart</text>
  </svg>
)

const SwiggyLogo = () => (
  <svg width="120" height="40" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="60" rx="4" fill="#FC8019"/>
    <text x="20" y="38" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white">Swiggy</text>
  </svg>
)

const ZomatoLogo = () => (
  <svg width="120" height="40" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="60" rx="4" fill="#E23744"/>
    <text x="20" y="38" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white">Zomato</text>
  </svg>
)

const HolidifyLogo = () => (
  <svg width="120" height="40" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="60" rx="4" fill="#017233"/>
    <text x="20" y="38" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="white">Holidify</text>
  </svg>
)

// Partner logos
const partnerLogos = [
  {
    id: 1,
    name: 'Google',
    logo: null,
    svg: GoogleLogo,
    link: 'https://www.google.com/'
  },
  {
    id: 2,
    name: 'Amazon',
    logo: null,
    svg: AmazonLogo,
    link: 'https://www.amazon.in/'
  },
  {
    id: 3,
    name: 'Flipkart',
    logo: null,
    svg: FlipkartLogo,
    link: 'https://www.flipkart.com/'
  },
  {
    id: 4,
    name: 'Swiggy',
    logo: null,
    svg: SwiggyLogo,
    link: 'https://www.swiggy.com/'
  },
  {
    id: 5,
    name: 'Zomato',
    logo: null,
    svg: ZomatoLogo,
    link: 'https://www.zomato.com/'
  },
  {
    id: 6,
    name: 'Holidify',
    logo: null,
    svg: HolidifyLogo,
    link: 'https://www.holidify.com/'
  }
]

// Logo component - displays clean professional logos like the example
const PartnerLogo = ({ partner }) => {
  const [imageError, setImageError] = useState(false)
  const SvgComponent = partner.svg
  
  const containerClasses = "h-16 md:h-20 lg:h-24 flex items-center justify-center px-4 md:px-6 lg:px-8"
  
  const logoContent = (
    <>
      {partner.logo && !imageError ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-full w-auto max-w-[180px] md:max-w-[220px] object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : SvgComponent ? (
        <div className="h-16 md:h-20 lg:h-24 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-300">
          <SvgComponent />
        </div>
      ) : (
        <div className="h-12 md:h-16 lg:h-20 px-6 md:px-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center min-w-[120px]">
          <span className="text-gray-700 font-semibold text-sm md:text-base whitespace-nowrap">{partner.name}</span>
        </div>
      )}
    </>
  )
  
  if (partner.link) {
    return (
      <a
        href={partner.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${containerClasses} cursor-pointer hover:scale-105 transition-transform duration-300 block relative z-10 pointer-events-auto`}
        aria-label={`Visit ${partner.name}`}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          window.open(partner.link, '_blank', 'noopener,noreferrer')
        }}
      >
        {logoContent}
      </a>
    )
  }
  
  return (
    <div className={containerClasses}>
      {logoContent}
    </div>
  )
}

function BrandingPartners() {
  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...partnerLogos, ...partnerLogos]

  return (
    <section className="w-full bg-white py-6 md:py-8 border-b border-gray-100">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          {/* Infinite Scrolling Logo Container */}
          <div className="flex animate-scroll items-center pointer-events-auto">
            {duplicatedLogos.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 relative z-10 pointer-events-auto"
              >
                <PartnerLogo partner={partner} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandingPartners

