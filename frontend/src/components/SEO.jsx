import { useEffect } from 'react';

/**
 * SEO Component for dynamic meta tags
 * Updates document head with SEO metadata
 */
const SEO = ({
  title = 'Safe Hands Travels - Your Trusted Travel Partner',
  description = 'Discover amazing travel experiences with Safe Hands Travels. Explore destinations, book trips, and create unforgettable memories.',
  keywords = 'travel, trips, destinations, adventure, tourism, India travel, travel agency',
  image = '/images/Logo.webp',
  url = '',
  type = 'website',
  siteName = 'Safe Hands Travels',
  author = 'Safe Hands Travels',
  locale = 'en_US',
  noindex = false,
  structuredData = null,
}) => {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://safehandstravels.com';
  
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  useEffect(() => {
    // Update title
    document.title = title;

    // Helper function to set or update meta tag
    const setMetaTag = (name, content, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper function to set or update link tag
    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Basic meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', author);
    
    // Robots
    if (noindex) {
      setMetaTag('robots', 'noindex, nofollow');
    } else {
      setMetaTag('robots', 'index, follow');
    }

    // Open Graph tags
    setMetaTag('og:title', title, 'property');
    setMetaTag('og:description', description, 'property');
    setMetaTag('og:image', imageUrl, 'property');
    setMetaTag('og:url', fullUrl, 'property');
    setMetaTag('og:type', type, 'property');
    setMetaTag('og:site_name', siteName, 'property');
    setMetaTag('og:locale', locale, 'property');

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', imageUrl);

    // Canonical URL
    setLinkTag('canonical', fullUrl);

    // Add structured data
    if (structuredData) {
      let scriptElement = document.querySelector('script[type="application/ld+json"]');
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, image, url, type, siteName, author, locale, noindex, structuredData, fullUrl, imageUrl]);

  return null;
};

export default SEO;

