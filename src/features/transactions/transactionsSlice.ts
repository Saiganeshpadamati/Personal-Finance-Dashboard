import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { INITIAL_TRANSACTIONS } from '../../app/seedData'
import { Transaction, TransactionCategory, TransactionFilterOptions } from '../../types'

interface TransactionsState {
  items: Transaction[]
}

const getInitialTransactions = (): Transaction[] => {
  try {
    const saved = localStorage.getItem('finflow_transactions')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // Fallback to initial seed data
  }
  return INITIAL_TRANSACTIONS
}

const initialState: TransactionsState = {
  items: getInitialTransactions(),
}

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Omit<Transaction, 'id'> & { id?: string }>) => {
      const newTransaction: Transaction = {
        ...action.payload,
        id: action.payload.id || `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      }
      state.items.unshift(newTransaction)
    },
    editTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload)
    },
    resetTransactions: (state) => {
      state.items = INITIAL_TRANSACTIONS
    },
  },
})

export const { addTransaction, editTransaction, deleteTransaction, resetTransactions } =
  transactionsSlice.actions

export default transactionsSlice.reducer

// Selectors
export const selectAllTransactions = (state: { transactions: TransactionsState }) =>
  state.transactions.items

/**
 * Filtered and sorted transactions selector
 */
export const selectFilteredTransactions = createSelector(
  [
    selectAllTransactions,
    (_state: { transactions: TransactionsState }, filters: TransactionFilterOptions) => filters,
  ],
  (transactions, filters) => {
    return transactions
      .filter((tx) => {
        // Search query filter (merchant or description)
        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase().trim()
          const matchesMerchant = tx.merchant.toLowerCase().includes(query)
          const matchesDesc = (tx.description || '').toLowerCase().includes(query)
          if (!matchesMerchant && !matchesDesc) return false
        }

        // Category filter
        if (filters.category !== 'All' && tx.category !== filters.category) {
          return false
        }

        // Type filter (income / expense)
        if (filters.type !== 'All' && tx.type !== filters.type) {
          return false
        }

        // Account filter
        if (filters.accountId !== 'All' && tx.accountId !== filters.accountId) {
          return false
        }

        // Status filter
        if (filters.status !== 'All' && tx.status !== filters.status) {
          return false
        }

        // Start Date filter
        if (filters.startDate) {
          const txDate = new Date(tx.date)
          const start = new Date(filters.startDate)
          start.setHours(0, 0, 0, 0)
          if (txDate < start) return false
        }

        // End Date filter
        if (filters.endDate) {
          const txDate = new Date(tx.date)
          const end = new Date(filters.endDate)
          end.setHours(23, 59, 59, 999)
          if (txDate > end) return false
        }

        return true
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'date-asc':
            return new Date(a.date).getTime() - new Date(b.date).getTime()
          case 'amount-desc':
            return b.amountInPaise - a.amountInPaise
          case 'amount-asc':
            return a.amountInPaise - b.amountInPaise
          case 'merchant-asc':
            return a.merchant.localeCompare(b.merchant)
          case 'date-desc':
          default:
            return new Date(b.date).getTime() - new Date(a.date).getTime()
        }
      })
  }
)

/**
 * Monthly totals and MoM comparisons
 */
export const selectMonthlyFinancialTotals = createSelector(
  [selectAllTransactions],
  (transactions) => {
    // Current month determination based on reference date (Nov 2026 or latest transaction month)
    let refDate = new Date()
    if (transactions.length > 0) {
      const sorted = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      refDate = new Date(sorted[0].date)
    }

    const currentYear = refDate.getFullYear()
    const currentMonth = refDate.getMonth()

    const prevMonthDate = new Date(currentYear, currentMonth - 1, 1)
    const prevYear = prevMonthDate.getFullYear()
    const prevMonth = prevMonthDate.getMonth()

    let currentIncome = 0
    let currentExpense = 0
    let prevIncome = 0
    let prevExpense = 0

    transactions.forEach((tx) => {
      const d = new Date(tx.date)
      const yr = d.getFullYear()
      const mo = d.getMonth()

      if (yr === currentYear && mo === currentMonth) {
        if (tx.type === 'income') currentIncome += tx.amountInPaise
        else if (tx.type === 'expense') currentExpense += tx.amountInPaise
      } else if (yr === prevYear && mo === prevMonth) {
        if (tx.type === 'income') prevIncome += tx.amountInPaise
        else if (tx.type === 'expense') prevExpense += tx.amountInPaise
      }
    })

    const currentSavings = currentIncome - currentExpense
    const prevSavings = prevIncome - prevExpense

    const savingsRate = currentIncome > 0 ? (currentSavings / currentIncome) * 100 : 0
    const prevSavingsRate = prevIncome > 0 ? (prevSavings / prevIncome) * 100 : 0

    const calcMoM = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0
      return ((curr - prev) / prev) * 100
    }

    return {
      currentMonthLabel: refDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      currentMonthIncomePaise: currentIncome,
      currentMonthExpensePaise: currentExpense,
      currentMonthSavingsPaise: currentSavings,
      currentMonthSavingsRate: savingsRate,
      incomeMoMChangePercent: calcMoM(currentIncome, prevIncome),
      expenseMoMChangePercent: calcMoM(currentExpense, prevExpense),
      savingsMoMChangePercent: calcMoM(currentSavings, prevSavings),
      savingsRateDiffPercent: savingsRate - prevSavingsRate,
    }
  }
)

/**
 * Breakdown of spending by category for the current month
 */
export const selectCurrentMonthCategorySpending = createSelector(
  [selectAllTransactions],
  (transactions) => {
    let refDate = new Date()
    if (transactions.length > 0) {
      const sorted = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      refDate = new Date(sorted[0].date)
    }

    const currentYear = refDate.getFullYear()
    const currentMonth = refDate.getMonth()

    const categoryMap = new Map<TransactionCategory, { amount: number; count: number }>()
    let totalExpense = 0

    transactions.forEach((tx) => {
      const d = new Date(tx.date)
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth && tx.type === 'expense') {
        totalExpense += tx.amountInPaise
        const existing = categoryMap.get(tx.category) || { amount: 0, count: 0 }
        categoryMap.set(tx.category, {
          amount: existing.amount + tx.amountInPaise,
          count: existing.count + 1,
        })
      }
    })

    const result = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amountInPaise: data.amount,
        count: data.count,
        percentage: totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.amountInPaise - a.amountInPaise)

    return {
      totalExpenseInPaise: totalExpense,
      categories: result,
    }
  }
)

/**
 * Last 6 months cash flow history for charts
 */
export const selectCashFlowHistory = createSelector(
  [selectAllTransactions],
  (transactions) => {
    let refDate = new Date()
    if (transactions.length > 0) {
      const sorted = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      refDate = new Date(sorted[0].date)
    }

    const months: {
      key: string
      label: string
      year: number
      month: number
      incomePaise: number
      expensePaise: number
      savingsPaise: number
    }[] = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date(refDate.getFullYear(), refDate.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleDateString('en-IN', { month: 'short' })
      months.push({
        key,
        label,
        year: d.getFullYear(),
        month: d.getMonth(),
        incomePaise: 0,
        expensePaise: 0,
        savingsPaise: 0,
      })
    }

    transactions.forEach((tx) => {
      const d = new Date(tx.date)
      const yr = d.getFullYear()
      const mo = d.getMonth()

      const targetMonth = months.find((m) => m.year === yr && m.month === mo)
      if (targetMonth) {
        if (tx.type === 'income') {
          targetMonth.incomePaise += tx.amountInPaise
        } else if (tx.type === 'expense') {
          targetMonth.expensePaise += tx.amountInPaise
        }
      }
    })

    return months.map((m) => ({
      ...m,
      savingsPaise: m.incomePaise - m.expensePaise,
    }))
  }
)
