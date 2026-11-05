import { describe, it, expect } from 'vitest'
import transactionsReducer, {
  addTransaction,
  editTransaction,
  deleteTransaction,
  selectFilteredTransactions,
  selectMonthlyFinancialTotals,
} from '../features/transactions/transactionsSlice'
import { Transaction } from '../types'

describe('Transactions Slice & Selectors', () => {
  const sampleTransactions: Transaction[] = [
    {
      id: 'tx-1',
      merchant: 'Revolut Salary',
      description: 'Monthly Salary',
      category: 'Salary',
      amountInPaise: 10000000, // ₹1,00,000
      type: 'income',
      date: '2026-11-01T10:00:00',
      paymentMethod: 'Net Banking',
      status: 'completed',
      accountId: 'acc-1',
    },
    {
      id: 'tx-2',
      merchant: 'Swiggy',
      description: 'Food delivery',
      category: 'Food & Dining',
      amountInPaise: 200000, // ₹2,000
      type: 'expense',
      date: '2026-11-02T19:00:00',
      paymentMethod: 'UPI',
      status: 'completed',
      accountId: 'acc-1',
    },
    {
      id: 'tx-3',
      merchant: 'Amazon India',
      description: 'Electronics',
      category: 'Shopping',
      amountInPaise: 500000, // ₹5,000
      type: 'expense',
      date: '2026-11-03T15:00:00',
      paymentMethod: 'Credit Card',
      status: 'completed',
      accountId: 'acc-4',
    },
  ]

  it('adds a new transaction and prepends to state', () => {
    const initialState = { items: sampleTransactions }
    const newTx = {
      merchant: 'Blue Tokai Coffee',
      description: 'Morning latte',
      category: 'Food & Dining' as const,
      amountInPaise: 35000,
      type: 'expense' as const,
      date: '2026-11-04T09:00:00',
      paymentMethod: 'UPI' as const,
      status: 'completed' as const,
      accountId: 'acc-1',
    }

    const state = transactionsReducer(initialState, addTransaction(newTx))
    expect(state.items.length).toBe(4)
    expect(state.items[0].merchant).toBe('Blue Tokai Coffee')
    expect(state.items[0].id).toBeDefined()
  })

  it('edits an existing transaction', () => {
    const initialState = { items: sampleTransactions }
    const updated = {
      ...sampleTransactions[1],
      amountInPaise: 250000, // changed to ₹2,500
      merchant: 'Swiggy Gourmet',
    }

    const state = transactionsReducer(initialState, editTransaction(updated))
    expect(state.items[1].amountInPaise).toBe(250000)
    expect(state.items[1].merchant).toBe('Swiggy Gourmet')
  })

  it('deletes a transaction by id', () => {
    const initialState = { items: sampleTransactions }
    const state = transactionsReducer(initialState, deleteTransaction('tx-2'))
    expect(state.items.length).toBe(2)
    expect(state.items.find((t) => t.id === 'tx-2')).toBeUndefined()
  })

  describe('selectFilteredTransactions', () => {
    it('filters by category correctly', () => {
      const state = { transactions: { items: sampleTransactions } }
      const filtered = selectFilteredTransactions(state, {
        searchQuery: '',
        category: 'Food & Dining',
        type: 'All',
        accountId: 'All',
        status: 'All',
        sortBy: 'date-desc',
      })

      expect(filtered.length).toBe(1)
      expect(filtered[0].category).toBe('Food & Dining')
    })

    it('filters by transaction type (income vs expense)', () => {
      const state = { transactions: { items: sampleTransactions } }
      const incomeOnly = selectFilteredTransactions(state, {
        searchQuery: '',
        category: 'All',
        type: 'income',
        accountId: 'All',
        status: 'All',
        sortBy: 'date-desc',
      })

      expect(incomeOnly.length).toBe(1)
      expect(incomeOnly[0].type).toBe('income')
    })

    it('searches by merchant name substring case-insensitively', () => {
      const state = { transactions: { items: sampleTransactions } }
      const results = selectFilteredTransactions(state, {
        searchQuery: 'amazon',
        category: 'All',
        type: 'All',
        accountId: 'All',
        status: 'All',
        sortBy: 'date-desc',
      })

      expect(results.length).toBe(1)
      expect(results[0].merchant).toBe('Amazon India')
    })
  })

  describe('selectMonthlyFinancialTotals', () => {
    it('computes accurate income, expense, and savings totals', () => {
      const state = { transactions: { items: sampleTransactions } }
      const totals = selectMonthlyFinancialTotals(state)

      expect(totals.currentMonthIncomePaise).toBe(10000000) // ₹1,00,000
      expect(totals.currentMonthExpensePaise).toBe(700000) // ₹7,000
      expect(totals.currentMonthSavingsPaise).toBe(9300000) // ₹93,000
      expect(totals.currentMonthSavingsRate).toBeCloseTo(93, 0)
    })
  })
})
