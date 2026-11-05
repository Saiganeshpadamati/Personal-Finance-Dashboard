import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { INITIAL_ACCOUNTS } from '../../app/seedData'
import { Account, AccountTransferPayload } from '../../types'

interface AccountsState {
  items: Account[]
}

const getInitialAccounts = (): Account[] => {
  try {
    const saved = localStorage.getItem('finflow_accounts')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // Fallback to seed data
  }
  return INITIAL_ACCOUNTS
}

const initialState: AccountsState = {
  items: getInitialAccounts(),
}

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    adjustAccountBalance: (
      state,
      action: PayloadAction<{ id: string; amountInPaise: number; isCredit: boolean }>
    ) => {
      const account = state.items.find((a) => a.id === action.payload.id)
      if (account) {
        if (action.payload.isCredit) {
          account.balanceInPaise += action.payload.amountInPaise
        } else {
          account.balanceInPaise -= action.payload.amountInPaise
        }
      }
    },
    transferBetweenAccounts: (state, action: PayloadAction<AccountTransferPayload>) => {
      const source = state.items.find((a) => a.id === action.payload.sourceAccountId)
      const destination = state.items.find((a) => a.id === action.payload.destinationAccountId)

      if (source && destination) {
        source.balanceInPaise -= action.payload.amountInPaise
        destination.balanceInPaise += action.payload.amountInPaise
      }
    },
    resetAccounts: (state) => {
      state.items = INITIAL_ACCOUNTS
    },
  },
})

export const { adjustAccountBalance, transferBetweenAccounts, resetAccounts } =
  accountsSlice.actions

export default accountsSlice.reducer

// Selectors
export const selectAllAccounts = (state: { accounts: AccountsState }) => state.accounts.items

export const selectAccountById = (id: string) =>
  createSelector([selectAllAccounts], (accounts) => accounts.find((a) => a.id === id))

export const selectNetWorthSummary = createSelector([selectAllAccounts], (accounts) => {
  let liquidCash = 0
  let investments = 0
  let creditDebt = 0
  let totalNetWorth = 0
  let totalCreditLimit = 0

  accounts.forEach((acc) => {
    totalNetWorth += acc.balanceInPaise

    if (acc.type === 'checking' || acc.type === 'savings') {
      liquidCash += acc.balanceInPaise
    } else if (acc.type === 'investment') {
      investments += acc.balanceInPaise
    } else if (acc.type === 'credit') {
      if (acc.balanceInPaise < 0) {
        creditDebt += Math.abs(acc.balanceInPaise)
      }
      if (acc.creditLimitInPaise) {
        totalCreditLimit += acc.creditLimitInPaise
      }
    }
  })

  return {
    totalNetWorthPaise: totalNetWorth,
    liquidCashPaise: liquidCash,
    investmentsPaise: investments,
    creditDebtPaise: creditDebt,
    totalCreditLimitPaise: totalCreditLimit,
  }
})
