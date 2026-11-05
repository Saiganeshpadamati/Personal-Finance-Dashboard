import { SupportedCurrency } from '../types'

/**
 * Converts integer paise to decimal rupees.
 * 1 INR = 100 paise.
 */
export const paiseToRupees = (paise: number): number => {
  return Math.round(paise) / 100
}

/**
 * Converts decimal rupees to integer paise without floating point issues.
 * e.g., 1250.50 -> 125050
 */
export const rupeesToPaise = (rupees: number): number => {
  return Math.round(rupees * 100)
}

/**
 * Currency locales map for proper regional number formatting
 */
const CURRENCY_LOCALES: Record<SupportedCurrency, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
}

/**
 * Currency exchange rate approximations (relative to INR base)
 * For portfolio presentation when switching display currencies
 */
const INR_CONVERSIONS: Record<SupportedCurrency, number> = {
  INR: 1,
  USD: 1 / 85,
  EUR: 1 / 92,
  GBP: 1 / 108,
}

/**
 * Format paise value to a locale-formatted currency string.
 * Uses Indian numbering system for INR (e.g., ₹1,25,000.00)
 */
export const formatCurrency = (
  paise: number,
  currency: SupportedCurrency = 'INR',
  options: {
    showSign?: boolean
    decimals?: number
  } = {}
): string => {
  const { showSign = false, decimals = 2 } = options
  const isNegative = paise < 0
  const absolutePaise = Math.abs(paise)

  // Convert from base INR paise to target currency decimal
  const baseRupees = paiseToRupees(absolutePaise)
  const convertedAmount = baseRupees * (INR_CONVERSIONS[currency] ?? 1)

  const locale = CURRENCY_LOCALES[currency] || 'en-IN'

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  const formatted = formatter.format(convertedAmount)

  if (isNegative) {
    return `-${formatted}`
  }

  if (showSign && paise > 0) {
    return `+${formatted}`
  }

  return formatted
}

/**
 * Compact Indian currency representation (e.g. ₹1.25L, ₹45K, ₹2.5Cr)
 */
export const formatCompactCurrency = (
  paise: number,
  currency: SupportedCurrency = 'INR'
): string => {
  const rupees = Math.abs(paiseToRupees(paise))
  const sign = paise < 0 ? '-' : ''

  if (currency === 'INR') {
    if (rupees >= 10000000) {
      return `${sign}₹${(rupees / 10000000).toFixed(2)} Cr`
    }
    if (rupees >= 100000) {
      return `${sign}₹${(rupees / 100000).toFixed(2)} L`
    }
    if (rupees >= 1000) {
      return `${sign}₹${(rupees / 1000).toFixed(1)} K`
    }
    return `${sign}₹${rupees.toFixed(0)}`
  }

  // Non-INR standard compact
  const converted = rupees * (INR_CONVERSIONS[currency] ?? 1)
  const formatter = new Intl.NumberFormat(CURRENCY_LOCALES[currency] || 'en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  })

  return `${sign}${formatter.format(converted)}`
}

/**
 * Formats a fraction or percentage as string (e.g. 78.4%)
 */
export const formatPercentage = (percentage: number, decimals = 1): string => {
  return `${percentage.toFixed(decimals)}%`
}
