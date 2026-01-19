/**
 * Cloudinary Image Optimization Utility
 * Automatically optimizes Cloudinary image URLs for better performance
 */

/**
 * Check if URL is a Cloudinary URL
 */
const isCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com')
}

/**
 * Get optimal image transformation parameters based on context
 * @param {string} url - Original image URL
 * @param {Object} options - Optimization options
 * @param {string} options.width - Desired width (e.g., '800', '1200')
 * @param {string} options.height - Desired height (optional)
 * @param {string} options.quality - Image quality: 'auto', 'best', 'good', 'eco', 'low' (default: 'auto')
 * @param {string} options.format - Image format: 'auto', 'webp', 'jpg', 'png' (default: 'auto')
 * @param {string} options.crop - Crop mode: 'fill', 'fit', 'scale', 'limit' (default: 'limit')
 * @param {boolean} options.lazy - Add placeholder for lazy loading
 * @returns {string} - Optimized image URL
 */
export const optimizeImage = (url, options = {}) => {
  if (!url || typeof url !== 'string') {
    return url || ''
  }

  // If not a Cloudinary URL, return as-is
  if (!isCloudinaryUrl(url)) {
    // For non-Cloudinary URLs, you can still add basic optimization
    // For now, return as-is to avoid breaking external URLs
    return url
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
    lazy = false,
  } = options

  // Parse Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{type}/upload/{transformations}/{version}/{public_id}.{format}
  // Or: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
  
  try {
    const urlObj = new URL(url)
    
    // Extract pathname parts
    const pathParts = urlObj.pathname.split('/')
    const uploadIndex = pathParts.indexOf('upload')
    
    if (uploadIndex === -1) {
      // URL doesn't have standard Cloudinary structure, return as-is
      return url
    }

    // Build transformation string
    const transformations = []
    
    if (width) transformations.push(`w_${width}`)
    if (height) transformations.push(`h_${height}`)
    
    // Quality optimization
    transformations.push(`q_${quality}`)
    
    // Format optimization (auto converts to WebP when supported)
    if (format === 'auto') {
      transformations.push('f_auto')
    } else {
      transformations.push(`f_${format}`)
    }
    
    // Crop mode
    if (crop) {
      transformations.push(`c_${crop}`)
    }
    
    // Lazy loading placeholder (blur effect)
    if (lazy) {
      transformations.push('e_blur:400')
    }
    
    // Combine all transformations
    const transformString = transformations.length > 0 
      ? `${transformations.join(',')}/`
      : ''
    
    // Reconstruct URL with transformations
    // Check if transformations already exist
    if (pathParts[uploadIndex + 1] && pathParts[uploadIndex + 1].startsWith('v')) {
      // Version exists, insert transformations before version
      pathParts.splice(uploadIndex + 1, 0, transformString)
    } else {
      // No version, insert transformations after upload
      pathParts.splice(uploadIndex + 1, 0, transformString)
    }
    
    urlObj.pathname = pathParts.join('/')
    
    return urlObj.toString()
  } catch (error) {
    console.warn('Error optimizing image URL:', error)
    return url // Return original URL on error
  }
}

/**
 * Get optimized image URL for card thumbnails (small, fast loading)
 */
export const getThumbnailUrl = (url) => {
  return optimizeImage(url, {
    width: '400',
    quality: 'auto',
    format: 'auto',
    crop: 'fill',
  })
}

/**
 * Get optimized image URL for gallery/hero images (high quality, but optimized)
 */
export const getGalleryUrl = (url, width = '1200') => {
  return optimizeImage(url, {
    width,
    quality: 'auto',
    format: 'auto',
    crop: 'limit',
  })
}

/**
 * Get optimized image URL for lightbox/fullscreen (high quality)
 */
export const getFullscreenUrl = (url) => {
  return optimizeImage(url, {
    width: '1920',
    quality: 'best',
    format: 'auto',
    crop: 'limit',
  })
}

/**
 * Get avatar/profile picture URL (small, square)
 */
export const getAvatarUrl = (url, size = '150') => {
  return optimizeImage(url, {
    width: size,
    height: size,
    quality: 'good',
    format: 'auto',
    crop: 'fill',
  })
}

/**
 * Simple helper: add Cloudinary transformations to any URL
 * This is a simpler approach that works by injecting transformation string
 */
export const addCloudinaryTransform = (url, transformString) => {
  if (!url || !isCloudinaryUrl(url)) return url
  
  try {
    // Find 'upload' in the path and insert transformation after it
    return url.replace('/upload/', `/upload/${transformString}/`)
  } catch (error) {
    return url
  }
}

/**
 * Quick optimization with sensible defaults
 */
export const quickOptimize = (url, maxWidth = 800) => {
  if (!isCloudinaryUrl(url)) return url
  const transform = `w_${maxWidth},q_auto,f_auto,c_limit`
  return addCloudinaryTransform(url, transform)
}

