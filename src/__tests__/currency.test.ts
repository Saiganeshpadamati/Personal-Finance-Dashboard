import { describe, it, expect } from 'vitest'
import {
  paiseToRupees,
  rupeesToPaise,
  formatCurrency,
  formatCompactCurrency,
  formatPercentage,
} from '../utils/currency'

describe('Financial Math & Currency Utilities', () => {
  it('converts paise to decimal rupees accurately', () => {
    expect(paiseToRupees(100)).toBe(1)
    expect(paiseToRupees(125050)).toBe(1250.5)
    expect(paiseToRupees(0)).toBe(0)
    expect(paiseToRupees(-5000)).toBe(-50)
  })

  it('converts rupees to integer paise without floating point issues', () => {
    expect(rupeesToPaise(1)).toBe(100)
    expect(rupeesToPaise(1250.5)).toBe(125050)
    expect(rupeesToPaise(0.1 + 0.2)).toBe(30) // solves classic 0.1 + 0.2 === 0.30000000000000004
    expect(rupeesToPaise(125000.75)).toBe(12500075)
  })

  it('formats INR using standard Indian numbering formatting', () => {
    // 1,25,000 INR = 12,500,000 paise
    const formatted = formatCurrency(12500000, 'INR')
    // Should contain ₹ and 1,25,000
    expect(formatted).toContain('₹')
    expect(formatted).toContain('1,25,000.00')
  })

  it('formats positive and negative amounts with proper signs', () => {
    const positiveWithSign = formatCurrency(50000, 'INR', { showSign: true })
    expect(positiveWithSign).toContain('+₹')

    const negative = formatCurrency(-50000, 'INR')
    expect(negative).toContain('-₹')
  })

  it('formats compact Indian representation correctly', () => {
    // ₹1.25 Lakhs (12,500,000 paise)
    expect(formatCompactCurrency(12500000, 'INR')).toBe('₹1.25 L')
    // ₹45 Thousand (4,500,000 paise)
    expect(formatCompactCurrency(4500000, 'INR')).toBe('₹45.0 K')
    // ₹2.5 Crore (2,500,000,000 paise = 25,000,000 rupees)
    expect(formatCompactCurrency(2500000000, 'INR')).toBe('₹2.50 Cr')
  })

  it('formats percentages with configurable decimals', () => {
    expect(formatPercentage(78.432, 1)).toBe('78.4%')
    expect(formatPercentage(100, 0)).toBe('100%')
  })
})
