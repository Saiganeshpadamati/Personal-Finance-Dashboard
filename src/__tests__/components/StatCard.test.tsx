import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import preferencesReducer from '../../features/preferences/preferencesSlice'
import { StatCard } from '../../components/common/StatCard'
import { Wallet } from 'lucide-react'

const createMockStore = () =>
  configureStore({
    reducer: {
      preferences: preferencesReducer,
    },
  })

describe('StatCard Component', () => {
  it('renders title and formatted Indian currency amount', () => {
    const store = createMockStore()
    render(
      <Provider store={store}>
        <StatCard
          title="Total Balance"
          amountInPaise={12500000} // ₹1,25,000.00
          changePercent={14.5}
          timeframeLabel="vs last month"
          icon={<Wallet data-testid="wallet-icon" />}
        />
      </Provider>
    )

    expect(screen.getByText('Total Balance')).toBeInTheDocument()
    expect(screen.getByText(/1,25,000/)).toBeInTheDocument()
    expect(screen.getByText(/\+14.5%/)).toBeInTheDocument()
    expect(screen.getByText('vs last month')).toBeInTheDocument()
  })

  it('renders inverse trend coloring for expense metrics', () => {
    const store = createMockStore()
    render(
      <Provider store={store}>
        <StatCard
          title="Monthly Expenses"
          amountInPaise={4500000}
          changePercent={8.2}
          isInverseTrend={true}
          icon={<Wallet />}
        />
      </Provider>
    )

    expect(screen.getByText('Monthly Expenses')).toBeInTheDocument()
    expect(screen.getByText(/\+8.2%/)).toBeInTheDocument()
  })
})
