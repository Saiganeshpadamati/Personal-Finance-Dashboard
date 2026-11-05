import { describe, it, expect } from 'vitest'
import budgetsReducer, {
  addBudget,
  updateBudget,
  deleteBudget,
  selectBudgetsWithProgress,
  selectOverallBudgetSummary,
} from '../features/budgets/budgetsSlice'
import { Budget, Transaction } from '../types'

describe('Budgets Slice & Calculation Logic', () => {
  const sampleBudgets: Budget[] = [
    {
      id: 'b-1',
      category: 'Food & Dining',
      limitInPaise: 1000000, // ₹10,000
      period: 'monthly',
      alertThresholdPercent: 80,
    },
    {
      id: 'b-2',
      category: 'Shopping',
      limitInPaise: 500000, // ₹5,000
      period: 'monthly',
      alertThresholdPercent: 75,
    },
  ]

  it('adds a new category budget', () => {
    const initialState = { items: sampleBudgets }
    const newBudget = {
      category: 'Transportation' as const,
      limitInPaise: 400000, // ₹4,000
      period: 'monthly' as const,
      alertThresholdPercent: 80,
    }

    const state = budgetsReducer(initialState, addBudget(newBudget))
    expect(state.items.length).toBe(3)
    expect(state.items.some((b) => b.category === 'Transportation')).toBe(true)
  })

  it('updates an existing category budget limit', () => {
    const initialState = { items: sampleBudgets }
    const updated = {
      ...sampleBudgets[0],
      limitInPaise: 1200000, // increased to ₹12,000
    }

    const state = budgetsReducer(initialState, updateBudget(updated))
    expect(state.items[0].limitInPaise).toBe(1200000)
  })

  it('deletes a budget target by id', () => {
    const initialState = { items: sampleBudgets }
    const state = budgetsReducer(initialState, deleteBudget('b-1'))
    expect(state.items.length).toBe(1)
    expect(state.items[0].id).toBe('b-2')
  })

  describe('selectBudgetsWithProgress and Threshold Conditions', () => {
    it('accurately computes spent, remaining, and status thresholds', () => {
      // 1. Food: spent 8,500 on 10,000 limit -> 85% -> Warning (threshold is 80%)
      // 2. Shopping: spent 6,000 on 5,000 limit -> 120% -> Exceeded
      const transactions: Transaction[] = [
        {
          id: 'tx-1',
          merchant: 'Swiggy',
          description: '',
          category: 'Food & Dining',
          amountInPaise: 850000, // ₹8,500
          type: 'expense',
          date: '2026-11-02T12:00:00',
          paymentMethod: 'UPI',
          status: 'completed',
          accountId: 'acc-1',
        },
        {
          id: 'tx-2',
          merchant: 'Zara',
          description: '',
          category: 'Shopping',
          amountInPaise: 600000, // ₹6,000
          type: 'expense',
          date: '2026-11-03T14:00:00',
          paymentMethod: 'Credit Card',
          status: 'completed',
          accountId: 'acc-4',
        },
      ]

      const state = {
        budgets: { items: sampleBudgets },
        transactions: { items: transactions },
      }

      const budgetsWithProgress = selectBudgetsWithProgress(state)

      // Food & Dining
      const food = budgetsWithProgress.find((b) => b.category === 'Food & Dining')!
      expect(food.spentInPaise).toBe(850000)
      expect(food.remainingInPaise).toBe(150000) // ₹1,500 left
      expect(food.percentageUsed).toBe(85)
      expect(food.status).toBe('warning')

      // Shopping
      const shopping = budgetsWithProgress.find((b) => b.category === 'Shopping')!
      expect(shopping.spentInPaise).toBe(600000)
      expect(shopping.remainingInPaise).toBe(-100000) // ₹1,000 exceeded
      expect(shopping.percentageUsed).toBe(120)
      expect(shopping.status).toBe('exceeded')
    })
  })

  describe('selectOverallBudgetSummary', () => {
    it('aggregates total limits and exceeded counts correctly', () => {
      const transactions: Transaction[] = [
        {
          id: 'tx-1',
          merchant: 'Swiggy',
          description: '',
          category: 'Food & Dining',
          amountInPaise: 850000,
          type: 'expense',
          date: '2026-11-02T12:00:00',
          paymentMethod: 'UPI',
          status: 'completed',
          accountId: 'acc-1',
        },
      ]

      const state = {
        budgets: { items: sampleBudgets },
        transactions: { items: transactions },
      }

      const summary = selectOverallBudgetSummary(state)
      expect(summary.totalLimitInPaise).toBe(1500000) // 10k + 5k = 15k
      expect(summary.totalSpentInPaise).toBe(850000)
      expect(summary.totalRemainingInPaise).toBe(650000)
      expect(summary.budgetCount).toBe(2)
      expect(summary.warningCount).toBe(1)
    })
  })
})
