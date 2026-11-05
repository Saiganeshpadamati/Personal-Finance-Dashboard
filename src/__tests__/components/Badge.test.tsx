import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Badge, StatusBadge, TypeBadge, CategoryBadge } from '../../components/common/Badge'

describe('Badge Components', () => {
  it('renders general Badge with text', () => {
    render(<Badge variant="success">Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders StatusBadge for completed, pending, and failed states', () => {
    const { rerender } = render(<StatusBadge status="completed" />)
    expect(screen.getByText('Completed')).toBeInTheDocument()

    rerender(<StatusBadge status="pending" />)
    expect(screen.getByText('Pending')).toBeInTheDocument()

    rerender(<StatusBadge status="failed" />)
    expect(screen.getByText('Failed')).toBeInTheDocument()
  })

  it('renders TypeBadge for income and expense', () => {
    const { rerender } = render(<TypeBadge type="income" />)
    expect(screen.getByText('Income')).toBeInTheDocument()

    rerender(<TypeBadge type="expense" />)
    expect(screen.getByText('Expense')).toBeInTheDocument()
  })

  it('renders CategoryBadge with category label', () => {
    render(<CategoryBadge category="Food & Dining" />)
    expect(screen.getByText('Food & Dining')).toBeInTheDocument()
  })
})
