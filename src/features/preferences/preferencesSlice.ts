import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { INITIAL_PREFERENCES } from '../../app/seedData'
import {
  DateFormatOption,
  NotificationSettings,
  SupportedCurrency,
  ThemeMode,
  UserProfile,
  UserPreferences,
} from '../../types'

interface PreferencesState {
  data: UserPreferences
}

const getInitialPreferences = (): UserPreferences => {
  try {
    const saved = localStorage.getItem('finflow_preferences')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    // Fallback to seed data
  }
  return INITIAL_PREFERENCES
}

const initialState: PreferencesState = {
  data: getInitialPreferences(),
}

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<SupportedCurrency>) => {
      state.data.currency = action.payload
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.data.theme = action.payload
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    toggleTheme: (state) => {
      state.data.theme = state.data.theme === 'dark' ? 'light' : 'dark'
      if (state.data.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    setDateFormat: (state, action: PayloadAction<DateFormatOption>) => {
      state.data.dateFormat = action.payload
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.data.notifications = {
        ...state.data.notifications,
        ...action.payload,
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.data.profile = {
        ...state.data.profile,
        ...action.payload,
      }
    },
    resetPreferences: (state) => {
      state.data = INITIAL_PREFERENCES
      document.documentElement.classList.remove('dark')
    },
  },
})

export const {
  setCurrency,
  setTheme,
  toggleTheme,
  setDateFormat,
  updateNotificationSettings,
  updateProfile,
  resetPreferences,
} = preferencesSlice.actions

export default preferencesSlice.reducer

// Selectors
export const selectPreferences = (state: { preferences: PreferencesState }) => state.preferences.data
export const selectCurrency = (state: { preferences: PreferencesState }) =>
  state.preferences.data.currency
export const selectTheme = (state: { preferences: PreferencesState }) => state.preferences.data.theme
export const selectDateFormat = (state: { preferences: PreferencesState }) =>
  state.preferences.data.dateFormat
export const selectProfile = (state: { preferences: PreferencesState }) =>
  state.preferences.data.profile
export const selectNotificationSettings = (state: { preferences: PreferencesState }) =>
  state.preferences.data.notifications
