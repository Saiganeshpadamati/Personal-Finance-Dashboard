import { describe, it, expect } from 'vitest'
import {
  transactionFormSchema,
  budgetFormSchema,
  transferFormSchema,
} from '../utils/validation'

describe('Zod Validation Schemas', () => {
  describe('transactionFormSchema', () => {
    it('validates a correct transaction payload', () => {
      const valid = {
        merchant: 'Swiggy',
        amount: 850,
        type: 'expense' as const,
        category: 'Food & Dining' as const,
        accountId: 'acc-1',
        date: '2026-11-05T12:00',
        paymentMethod: 'UPI' as const,
        description: 'Lunch with colleagues',
        status: 'completed' as const,
      }

      const result = transactionFormSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('rejects an empty or too short merchant name', () => {
      const invalid = {
        merchant: 'A',
        amount: 500,
        type: 'expense' as const,
        category: 'Food & Dining' as const,
        accountId: 'acc-1',
        date: '2026-11-05',
        paymentMethod: 'UPI' as const,
        description: '',
        status: 'completed' as const,
      }

      const result = transactionFormSchema.safeParse(invalid)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters')
      }
    })

    it('rejects negative or zero amounts', () => {
      const zeroAmount = {
        merchant: 'Coffee Shop',
        amount: 0,
        type: 'expense' as const,
        category: 'Food & Dining' as const,
        accountId: 'acc-1',
        date: '2026-11-05',
        paymentMethod: 'UPI' as const,
        description: '',
        status: 'completed' as const,
      }

      const result = transactionFormSchema.safeParse(zeroAmount)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('greater than zero')
      }
    })
  })

  describe('budgetFormSchema', () => {
    it('validates a proper budget target', () => {
      const valid = {
        category: 'Shopping' as const,
        limit: 15000,
        period: 'monthly' as const,
        alertThresholdPercent: 85,
      }

      const result = budgetFormSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('rejects an alert threshold below 50%', () => {
      const invalid = {
        category: 'Transportation' as const,
        limit: 10000,
        period: 'monthly' as const,
        alertThresholdPercent: 30,
      }

      const result = budgetFormSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })

  describe('transferFormSchema', () => {
    it('validates a valid account transfer', () => {
      const valid = {
        sourceAccountId: 'acc-1',
        destinationAccountId: 'acc-2',
        amount: 5000,
        description: 'Savings',
      }

      const result = transferFormSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('rejects transfer when source and destination accounts are identical', () => {
      const invalid = {
        sourceAccountId: 'acc-1',
        destinationAccountId: 'acc-1',
        amount: 5000,
        description: 'Self',
      }

      const result = transferFormSchema.safeParse(invalid)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('must be different')
      }
    })
  })
})
