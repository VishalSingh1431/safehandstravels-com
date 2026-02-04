import { useState, useEffect, useMemo } from 'react'
import { COUNTRY_CODES, parsePhoneValue, formatFullPhone } from '../utils/countryCodes'

/**
 * Reusable phone input with country code dropdown.
 * value: full phone string e.g. "+91 9876543210"
 * onChange: (fullValue) => void
 */
export default function PhoneInputWithCountry({
  value = '',
  onChange,
  id,
  name = 'phone',
  placeholder = 'Enter phone number',
  className = '',
  inputClassName = '',
  selectClassName = '',
  error = false,
  required = false,
  disabled = false,
  maxLength,
  ...rest
}) {
  const parsed = useMemo(() => parsePhoneValue(value), [value])
  const [countryCode, setCountryCode] = useState(parsed.countryCode)
  const [number, setNumber] = useState(parsed.number)

  useEffect(() => {
    const p = parsePhoneValue(value)
    setCountryCode(p.countryCode)
    setNumber(p.number)
  }, [value])

  const handleCodeChange = (e) => {
    const code = e.target.value
    setCountryCode(code)
    onChange(formatFullPhone(code, number))
  }

  const handleNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '')
    const limited = maxLength ? raw.slice(0, maxLength) : raw
    setNumber(limited)
    onChange(formatFullPhone(countryCode, limited))
  }

  const borderClass = error ? 'border-red-500' : 'border-gray-300'
  const focusRingClass = error ? 'focus:ring-red-500/20 focus:border-red-500' : 'focus:ring-[#017233]/20 focus:border-[#017233]'
  const disabledClass = disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'bg-white'

  return (
    <div className={`flex rounded-xl overflow-hidden border-2 ${borderClass} focus-within:ring-2 ${error ? 'focus-within:ring-red-500/20' : 'focus-within:ring-[#017233]/20'} ${className}`}>
      <select
        aria-label="Country code"
        value={countryCode}
        onChange={handleCodeChange}
        disabled={disabled}
        className={`px-3 py-3 border-0 bg-gray-50/80 outline-none w-auto min-w-[110px] max-w-[140px] text-gray-700 ${selectClassName} ${disabledClass}`}
        style={{ appearance: 'auto' }}
      >
        {COUNTRY_CODES.map(({ code, country, dial }) => (
          <option key={dial || code} value={code}>
            {code} {country}
          </option>
        ))}
      </select>
      <input
        type="tel"
        id={id}
        name={name}
        value={number}
        onChange={handleNumberChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        className={`flex-1 px-4 py-3 border-0 rounded-none outline-none ${focusRingClass} focus:ring-0 ${inputClassName} ${disabledClass}`}
        {...rest}
      />
    </div>
  )
}
