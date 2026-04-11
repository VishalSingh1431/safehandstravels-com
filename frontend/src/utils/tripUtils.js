/**
 * Normalize trip location to string (API may return string or array)
 */
export function getLocationString(location, city = null) {
  let locStr = '';
  if (location != null) {
    if (typeof location === 'string') locStr = location;
    else if (Array.isArray(location)) locStr = location.join(' ');
    else locStr = String(location);
  }
  
  if (city && city.trim()) {
    return locStr ? `${locStr} • ${city}` : city;
  }
  return locStr;
}

/**
 * Flatten a value to a single string for search (handles arrays and objects)
 */
function toSearchText(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value.map(item => {
      if (item == null) return ''
      if (typeof item === 'string') return item
      if (typeof item === 'object') return Object.values(item).map(toSearchText).join(' ')
      return String(item)
    }).join(' ')
  }
  if (typeof value === 'object') return Object.values(value).map(toSearchText).join(' ')
  return String(value)
}

/**
 * Return true if the search query appears anywhere in the trip (title, intro, itinerary, faq, etc.)
 */
export function tripMatchesSearch(trip, searchQuery) {
  if (!trip || !searchQuery || !searchQuery.trim()) return true
  const q = searchQuery.toLowerCase().trim()
  const location = getLocationString(trip.location).toLowerCase()
  const city = (trip.city || '').toLowerCase()
  const title = (trip.title || '').toLowerCase()
  
  return location.includes(q) || city.includes(q) || title.includes(q)
}

/**
 * Trigger the lead capture form globally via custom event
 */
export function triggerEnquiryForm() {
  const event = new CustomEvent('open-lead-form')
  window.dispatchEvent(event)
}
