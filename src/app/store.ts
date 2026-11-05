import { configureStore } from '@reduxjs/toolkit'
import transactionsReducer from '../features/transactions/transactionsSlice'
import budgetsReducer from '../features/budgets/budgetsSlice'
import accountsReducer from '../features/accounts/accountsSlice'
import preferencesReducer from '../features/preferences/preferencesSlice'

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    budgets: budgetsReducer,
    accounts: accountsReducer,
    preferences: preferencesReducer,
  },
})

// Persistence subscriber: saves Redux state to localStorage on updates
let previousState = store.getState()
store.subscribe(() => {
  const currentState = store.getState()

  if (currentState.transactions !== previousState.transactions) {
    try {
      localStorage.setItem(
        'finflow_transactions',
        JSON.stringify(currentState.transactions.items)
      )
    } catch (e) {
      console.error('Failed to persist transactions', e)
    }
  }

  if (currentState.budgets !== previousState.budgets) {
    try {
      localStorage.setItem('finflow_budgets', JSON.stringify(currentState.budgets.items))
    } catch (e) {
      console.error('Failed to persist budgets', e)
    }
  }

  if (currentState.accounts !== previousState.accounts) {
    try {
      localStorage.setItem('finflow_accounts', JSON.stringify(currentState.accounts.items))
    } catch (e) {
      console.error('Failed to persist accounts', e)
    }
  }

  if (currentState.preferences !== previousState.preferences) {
    try {
      localStorage.setItem(
        'finflow_preferences',
        JSON.stringify(currentState.preferences.data)
      )
    } catch (e) {
      console.error('Failed to persist preferences', e)
    }
  }

  previousState = currentState
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
