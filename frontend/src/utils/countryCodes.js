// Common country dial codes for phone input dropdown
export const COUNTRY_CODES = [
  { code: '+91', country: 'India', dial: '91' },
  { code: '+1', country: 'USA / Canada', dial: '1' },
  { code: '+44', country: 'UK', dial: '44' },
  { code: '+971', country: 'UAE', dial: '971' },
  { code: '+61', country: 'Australia', dial: '61' },
  { code: '+81', country: 'Japan', dial: '81' },
  { code: '+86', country: 'China', dial: '86' },
  { code: '+49', country: 'Germany', dial: '49' },
  { code: '+33', country: 'France', dial: '33' },
  { code: '+39', country: 'Italy', dial: '39' },
  { code: '+34', country: 'Spain', dial: '34' },
  { code: '+31', country: 'Netherlands', dial: '31' },
  { code: '+41', country: 'Switzerland', dial: '41' },
  { code: '+43', country: 'Austria', dial: '43' },
  { code: '+32', country: 'Belgium', dial: '32' },
  { code: '+46', country: 'Sweden', dial: '46' },
  { code: '+47', country: 'Norway', dial: '47' },
  { code: '+45', country: 'Denmark', dial: '45' },
  { code: '+358', country: 'Finland', dial: '358' },
  { code: '+353', country: 'Ireland', dial: '353' },
  { code: '+351', country: 'Portugal', dial: '351' },
  { code: '+48', country: 'Poland', dial: '48' },
  { code: '+7', country: 'Russia / Kazakhstan', dial: '7' },
  { code: '+82', country: 'South Korea', dial: '82' },
  { code: '+65', country: 'Singapore', dial: '65' },
  { code: '+60', country: 'Malaysia', dial: '60' },
  { code: '+66', country: 'Thailand', dial: '66' },
  { code: '+63', country: 'Philippines', dial: '63' },
  { code: '+64', country: 'New Zealand', dial: '64' },
  { code: '+27', country: 'South Africa', dial: '27' },
  { code: '+234', country: 'Nigeria', dial: '234' },
  { code: '+254', country: 'Kenya', dial: '254' },
  { code: '+20', country: 'Egypt', dial: '20' },
  { code: '+972', country: 'Israel', dial: '972' },
  { code: '+966', country: 'Saudi Arabia', dial: '966' },
  { code: '+974', country: 'Qatar', dial: '974' },
  { code: '+973', country: 'Bahrain', dial: '973' },
  { code: '+968', country: 'Oman', dial: '968' },
  { code: '+964', country: 'Iraq', dial: '964' },
  { code: '+98', country: 'Iran', dial: '98' },
  { code: '+92', country: 'Pakistan', dial: '92' },
  { code: '+880', country: 'Bangladesh', dial: '880' },
  { code: '+94', country: 'Sri Lanka', dial: '94' },
  { code: '+95', country: 'Myanmar', dial: '95' },
  { code: '+84', country: 'Vietnam', dial: '84' },
  { code: '+62', country: 'Indonesia', dial: '62' },
  { code: '+55', country: 'Brazil', dial: '55' },
  { code: '+52', country: 'Mexico', dial: '52' },
  { code: '+54', country: 'Argentina', dial: '54' },
  { code: '+57', country: 'Colombia', dial: '57' },
  { code: '+56', country: 'Chile', dial: '56' },
  { code: '+51', country: 'Peru', dial: '51' },
  { code: '+30', country: 'Greece', dial: '30' },
  { code: '+90', country: 'Turkey', dial: '90' },
  { code: '+212', country: 'Morocco', dial: '212' },
  { code: '+213', country: 'Algeria', dial: '213' },
  { code: '+216', country: 'Tunisia', dial: '216' },
  { code: '+250', country: 'Rwanda', dial: '250' },
  { code: '+255', country: 'Tanzania', dial: '255' },
  { code: '+256', country: 'Uganda', dial: '256' },
  { code: '+233', country: 'Ghana', dial: '233' },
  { code: '+237', country: 'Cameroon', dial: '237' },
  { code: '+263', country: 'Zimbabwe', dial: '263' },
  { code: '+260', country: 'Zambia', dial: '260' },
]

// Parse a full phone string (e.g. "+91 9876543210") into { countryCode, number }
export function parsePhoneValue(value) {
  if (!value || typeof value !== 'string') {
    return { countryCode: '+91', number: '' }
  }
  const trimmed = value.trim()
  if (!trimmed) return { countryCode: '+91', number: '' }
  const match = trimmed.match(/^(\+\d{1,4})\s*(.*)$/)
  if (match) {
    const code = match[1]
    const num = (match[2] || '').replace(/\D/g, '')
    return { countryCode: code, number: num }
  }
  const digitsOnly = trimmed.replace(/\D/g, '')
  if (digitsOnly.length <= 4 && trimmed.startsWith('+')) {
    const code = COUNTRY_CODES.find(c => c.code === trimmed || c.dial === digitsOnly)
    return { countryCode: code ? code.code : '+91', number: '' }
  }
  if (digitsOnly.length > 0 && !trimmed.startsWith('+')) {
    return { countryCode: '+91', number: digitsOnly }
  }
  return { countryCode: '+91', number: digitsOnly }
}

// Build full phone string from country code and number
export function formatFullPhone(countryCode, number) {
  const digits = (number || '').replace(/\D/g, '')
  if (!digits) return countryCode ? `${countryCode} ` : ''
  return `${countryCode || '+91'} ${digits}`
}

// Validate full phone string (at least 10 digits, optional country code)
export function isValidPhone(value) {
  if (!value || typeof value !== 'string') return false
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}
