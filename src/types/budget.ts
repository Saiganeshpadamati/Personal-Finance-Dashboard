import { TransactionCategory } from './transaction'

export type BudgetPeriod = 'monthly'

export interface Budget {
  id: string
  category: TransactionCategory
  limitInPaise: number // Integer representation in paise
  period: BudgetPeriod
  alertThresholdPercent?: number // Default 80%
}

export interface BudgetWithProgress extends Budget {
  spentInPaise: number
  remainingInPaise: number
  percentageUsed: number
  status: 'normal' | 'warning' | 'exceeded'
  transactionCount: number
}
