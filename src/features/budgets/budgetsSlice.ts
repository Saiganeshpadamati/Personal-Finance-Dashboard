import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { INITIAL_BUDGETS } from '../../app/seedData'
import { Budget, BudgetWithProgress } from '../../types'
import { selectAllTransactions } from '../transactions/transactionsSlice'

interface BudgetsState {
  items: Budget[]
}

const getInitialBudgets = (): Budget[] => {
  try {
    const saved = localStorage.getItem('finflow_budgets')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // Fallback to seed data
  }
  return INITIAL_BUDGETS
}

const initialState: BudgetsState = {
  items: getInitialBudgets(),
}

export const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    addBudget: (state, action: PayloadAction<Omit<Budget, 'id'> & { id?: string }>) => {
      // Check if budget for category already exists
      const existing = state.items.find((b) => b.category === action.payload.category)
      if (existing) {
        existing.limitInPaise = action.payload.limitInPaise
        existing.alertThresholdPercent = action.payload.alertThresholdPercent ?? 80
      } else {
        state.items.push({
          ...action.payload,
          id: action.payload.id || `b-${Date.now()}`,
          alertThresholdPercent: action.payload.alertThresholdPercent ?? 80,
        })
      }
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.items.findIndex((b) => b.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteBudget: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((b) => b.id !== action.payload)
    },
    resetBudgets: (state) => {
      state.items = INITIAL_BUDGETS
    },
  },
})

export const { addBudget, updateBudget, deleteBudget, resetBudgets } = budgetsSlice.actions

export default budgetsSlice.reducer

// Base selector
export const selectAllBudgets = (state: { budgets: BudgetsState }) => state.budgets.items

/**
 * Derives dynamic budget progress by combining budget limits with actual transactions for the active month
 */
export const selectBudgetsWithProgress = createSelector(
  [selectAllBudgets, selectAllTransactions],
  (budgets, transactions): BudgetWithProgress[] => {
    // Determine current month reference
    let refDate = new Date()
    if (transactions.length > 0) {
      const sorted = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      refDate = new Date(sorted[0].date)
    }

    const currentYear = refDate.getFullYear()
    const currentMonth = refDate.getMonth()

    // Aggregate spending by category for the current month
    const spentByCategory = new Map<string, { spent: number; count: number }>()

    transactions.forEach((tx) => {
      const d = new Date(tx.date)
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth && tx.type === 'expense') {
        const existing = spentByCategory.get(tx.category) || { spent: 0, count: 0 }
        spentByCategory.set(tx.category, {
          spent: existing.spent + tx.amountInPaise,
          count: existing.count + 1,
        })
      }
    })

    return budgets.map((b) => {
      const data = spentByCategory.get(b.category) || { spent: 0, count: 0 }
      const spentInPaise = data.spent
      const remainingInPaise = b.limitInPaise - spentInPaise
      const percentageUsed = b.limitInPaise > 0 ? (spentInPaise / b.limitInPaise) * 100 : 0

      const threshold = b.alertThresholdPercent ?? 80
      let status: 'normal' | 'warning' | 'exceeded' = 'normal'
      if (percentageUsed >= 100) {
        status = 'exceeded'
      } else if (percentageUsed >= threshold) {
        status = 'warning'
      }

      return {
        ...b,
        spentInPaise,
        remainingInPaise,
        percentageUsed,
        status,
        transactionCount: data.count,
      }
    })
  }
)

/**
 * Aggregated monthly budget overview
 */
export const selectOverallBudgetSummary = createSelector(
  [selectBudgetsWithProgress],
  (budgetsWithProgress) => {
    const totalLimitInPaise = budgetsWithProgress.reduce((sum, b) => sum + b.limitInPaise, 0)
    const totalSpentInPaise = budgetsWithProgress.reduce((sum, b) => sum + b.spentInPaise, 0)
    const totalRemainingInPaise = totalLimitInPaise - totalSpentInPaise
    const overallPercentageUsed =
      totalLimitInPaise > 0 ? (totalSpentInPaise / totalLimitInPaise) * 100 : 0

    const exceededCount = budgetsWithProgress.filter((b) => b.status === 'exceeded').length
    const warningCount = budgetsWithProgress.filter((b) => b.status === 'warning').length
    const onTrackCount = budgetsWithProgress.filter((b) => b.status === 'normal').length

    return {
      totalLimitInPaise,
      totalSpentInPaise,
      totalRemainingInPaise,
      overallPercentageUsed,
      exceededCount,
      warningCount,
      onTrackCount,
      budgetCount: budgetsWithProgress.length,
    }
  }
)
