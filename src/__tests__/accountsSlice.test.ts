import { describe, it, expect } from 'vitest'
import accountsReducer, {
  adjustAccountBalance,
  transferBetweenAccounts,
  selectNetWorthSummary,
} from '../features/accounts/accountsSlice'
import { Account } from '../types'

describe('Accounts Slice & Net Worth Calculations', () => {
  const sampleAccounts: Account[] = [
    {
      id: 'acc-1',
      name: 'HDFC Salary Account',
      type: 'checking',
      institution: 'HDFC Bank',
      balanceInPaise: 10000000, // ₹1,00,000
      accountNumberMasked: '•••• 1234',
      currency: 'INR',
      status: 'active',
      color: '#0e8ce4',
    },
    {
      id: 'acc-2',
      name: 'Zerodha Demat',
      type: 'investment',
      institution: 'Zerodha',
      balanceInPaise: 50000000, // ₹5,00,000
      accountNumberMasked: '•••• 5678',
      currency: 'INR',
      status: 'active',
      color: '#10b981',
    },
    {
      id: 'acc-3',
      name: 'Axis Neo Credit Card',
      type: 'credit',
      institution: 'Axis Bank',
      balanceInPaise: -2000000, // -₹20,000 debt
      creditLimitInPaise: 10000000, // ₹1,00,000 limit
      accountNumberMasked: '•••• 9999',
      currency: 'INR',
      status: 'active',
      color: '#f43f5e',
    },
  ]

  it('adjusts account balance for credit and debit events', () => {
    const initialState = { items: sampleAccounts }
    // Credit ₹10,000 (1,000,000 paise) to acc-1
    const credited = accountsReducer(
      initialState,
      adjustAccountBalance({ id: 'acc-1', amountInPaise: 1000000, isCredit: true })
    )
    expect(credited.items[0].balanceInPaise).toBe(11000000)

    // Debit ₹5,000 (500,000 paise) from acc-1
    const debited = accountsReducer(
      credited,
      adjustAccountBalance({ id: 'acc-1', amountInPaise: 500000, isCredit: false })
    )
    expect(debited.items[0].balanceInPaise).toBe(10500000)
  })

  it('executes atomic transfer between accounts', () => {
    const initialState = { items: sampleAccounts }
    // Transfer ₹20,000 from acc-1 to acc-2
    const state = accountsReducer(
      initialState,
      transferBetweenAccounts({
        sourceAccountId: 'acc-1',
        destinationAccountId: 'acc-2',
        amountInPaise: 2000000,
        description: 'Investment allocation',
        date: '2026-11-05',
      })
    )

    const source = state.items.find((a) => a.id === 'acc-1')!
    const dest = state.items.find((a) => a.id === 'acc-2')!

    expect(source.balanceInPaise).toBe(8000000) // 100k - 20k = 80k
    expect(dest.balanceInPaise).toBe(52000000) // 500k + 20k = 520k
  })

  it('calculates total net worth, liquid cash, investments, and debt accurately', () => {
    const state = { accounts: { items: sampleAccounts } }
    const summary = selectNetWorthSummary(state)

    // 100k (liquid) + 500k (invest) - 20k (debt) = 580k net worth
    expect(summary.liquidCashPaise).toBe(10000000)
    expect(summary.investmentsPaise).toBe(50000000)
    expect(summary.creditDebtPaise).toBe(2000000)
    expect(summary.totalNetWorthPaise).toBe(58000000)
  })
})
