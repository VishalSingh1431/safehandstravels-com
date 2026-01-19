/**
 * Structured Data (JSON-LD) generators for SEO
 */

const baseUrl = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'https://safehandstravels.com';

/**
 * Organization structured data
 */
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Safe Hands Travels',
  alternateName: 'Safe Hands Travels',
  url: baseUrl,
  logo: `${baseUrl}/images/Logo.webp`,
  description: 'Your trusted partner for unforgettable travel experiences. We make your dreams come true, one destination at a time.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Travel Street',
    addressLocality: 'Adventure City',
    postalCode: 'AC 12345',
    addressCountry: 'IN'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-8448801998',
    contactType: 'Customer Service',
    email: 'info@safehandstravels.com',
    availableLanguage: ['English', 'Hindi']
  },
  sameAs: [
    'https://www.facebook.com/safehandstravels',
    'https://www.instagram.com/safehandstravels',
    'https://www.twitter.com/safehandstravels',
    'https://www.linkedin.com/company/safehandstravels'
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150'
  }
});

/**
 * Trip/Tour structured data
 */
export const getTripSchema = (trip) => {
  if (!trip) return null;

  const tripUrl = `${baseUrl}/trip/${trip.id}`;
  const imageUrl = trip.imageUrl || trip.image || `${baseUrl}/images/Logo.webp`;

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.title,
    description: trip.intro || trip.subtitle || `Experience ${trip.title} - ${trip.location}`,
    image: imageUrl,
    url: tripUrl,
    location: {
      '@type': 'Place',
      name: trip.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: trip.location,
        addressCountry: 'IN'
      }
    },
    duration: trip.duration,
    offers: {
      '@type': 'Offer',
      price: trip.price || '0',
      priceCurrency: 'INR',
      availability: trip.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: tripUrl
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'Safe Hands Travels',
      url: baseUrl
    },
    ...(trip.reviews && trip.reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (trip.reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / trip.reviews.length).toFixed(1),
        reviewCount: trip.reviews.length
      },
      review: trip.reviews.slice(0, 5).map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author || 'Anonymous'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating || 5
        },
        reviewBody: review.text || ''
      }))
    })
  };
};

/**
 * Breadcrumb structured data
 */
export const getBreadcrumbSchema = (items) => {
  if (!items || items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  };
};

/**
 * FAQ structured data
 */
export const getFAQSchema = (faqs) => {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question || faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer || faq.a
      }
    }))
  };
};

/**
 * Review structured data
 */
export const getReviewSchema = (review) => {
  if (!review) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author || review.name || 'Anonymous'
    },
    datePublished: review.date || new Date().toISOString(),
    reviewBody: review.text || review.review || '',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating || 5,
      bestRating: 5,
      worstRating: 1
    },
    itemReviewed: {
      '@type': 'TravelAgency',
      name: 'Safe Hands Travels'
    }
  };
};

/**
 * Website structured data
 */
export const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Safe Hands Travels',
  alternateName: 'Safe Hands Travels',
  url: baseUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/search?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
});

