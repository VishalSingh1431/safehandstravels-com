import { useState, useEffect } from 'react'
import CertificateCard from './card/CertificateCard'

const certificates = [
  {
    id: 1,
    title: 'ISO Certified',
    images: [
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=60'
    ],
    description: 'We are ISO certified for quality and safety standards'
  },
  {
    id: 2,
    title: 'Legal Compliance',
    images: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=60'
    ],
    description: 'Fully compliant with all travel regulations and licenses'
  }
]

function CertificateLegal() {
  const [currentIndices, setCurrentIndices] = useState({ 1: 0, 2: 0 })

  useEffect(() => {
    const intervals = certificates.map((cert) => {
      return setInterval(() => {
        setCurrentIndices((prev) => ({
          ...prev,
          [cert.id]: (prev[cert.id] + 1) % cert.images.length
        }))
      }, 3500)
    })

    return () => {
      intervals.forEach((interval) => clearInterval(interval))
    }
  }, [])

  const goToSlide = (certId, index) => {
    setCurrentIndices((prev) => ({ ...prev, [certId]: index }))
  }

  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Certificate & Legal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              currentIndex={currentIndices[certificate.id]}
              onIndexChange={goToSlide}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CertificateLegal

