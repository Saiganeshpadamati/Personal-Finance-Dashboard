export type SupportedCurrency = 'INR' | 'USD' | 'EUR' | 'GBP'
export type ThemeMode = 'light' | 'dark' | 'system'
export type DateFormatOption = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'

export interface NotificationSettings {
  budgetAlerts: boolean
  weeklyDigest: boolean
  largeTransactionAlerts: boolean
  largeTransactionThresholdPaise: number
}

export interface UserProfile {
  name: string
  email: string
  role: string
  avatarUrl: string
  joinedDate: string
}

export interface UserPreferences {
  currency: SupportedCurrency
  theme: ThemeMode
  dateFormat: DateFormatOption
  notifications: NotificationSettings
  profile: UserProfile
}
