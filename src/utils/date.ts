import { DateFormatOption } from '../types'

/**
 * Parses an ISO date string or Date object into a standard Date
 */
export const toDate = (date: string | Date): Date => {
  return typeof date === 'string' ? new Date(date) : date
}

/**
 * Formats date into readable string based on user preference
 */
export const formatDate = (
  dateInput: string | Date,
  format: DateFormatOption = 'DD/MM/YYYY'
): string => {
  const d = toDate(dateInput)
  if (isNaN(d.getTime())) return 'Invalid date'

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  switch (format) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'DD/MM/YYYY':
    default:
      return `${day}/${month}/${year}`
  }
}

/**
 * Friendly relative or short formatted date: "Today", "Yesterday", or "05 Nov, 2026"
 */
export const formatFriendlyDate = (dateInput: string | Date): string => {
  const d = toDate(dateInput)
  if (isNaN(d.getTime())) return ''

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())

  const diffDays = Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'

  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Returns month label: "November 2026" or "Nov 2026"
 */
export const formatMonthYear = (dateInput: string | Date, short = false): string => {
  const d = toDate(dateInput)
  return d.toLocaleDateString('en-IN', {
    month: short ? 'short' : 'long',
    year: 'numeric',
  })
}

/**
 * Checks if a date falls within a given day window relative to referenceDate (defaults to today)
 */
export const isWithinDays = (
  dateInput: string | Date,
  days: number,
  referenceDate = new Date()
): boolean => {
  const target = toDate(dateInput).getTime()
  const refTime = referenceDate.getTime()
  const diffTime = refTime - target
  const maxDiff = days * 24 * 60 * 60 * 1000
  return diffTime >= 0 && diffTime <= maxDiff
}

/**
 * Checks if date is in the same calendar month and year
 */
export const isSameMonthAndYear = (
  dateInput: string | Date,
  month: number, // 0-indexed
  year: number
): boolean => {
  const d = toDate(dateInput)
  return d.getMonth() === month && d.getFullYear() === year
}
