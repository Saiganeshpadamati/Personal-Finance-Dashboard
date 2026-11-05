export type TransactionType = 'income' | 'expense'

export type TransactionCategory =
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Food & Dining'
  | 'Shopping'
  | 'Transportation'
  | 'Entertainment'
  | 'Utilities & Bills'
  | 'Education'
  | 'Healthcare'
  | 'Travel'
  | 'Personal Care'
  | 'Transfer'
  | 'Other'

export type PaymentMethod =
  | 'UPI'
  | 'Net Banking'
  | 'Debit Card'
  | 'Credit Card'
  | 'Cash'

export type TransactionStatus = 'completed' | 'pending' | 'failed'

export interface Transaction {
  id: string
  merchant: string
  description: string
  category: TransactionCategory
  amountInPaise: number // Integer representation in Paise (1 INR = 100 paise)
  type: TransactionType
  date: string // ISO 8601 date string YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  paymentMethod: PaymentMethod
  status: TransactionStatus
  accountId: string // Associated account identifier
}

export interface TransactionFilterOptions {
  searchQuery: string
  category: TransactionCategory | 'All'
  type: TransactionType | 'All'
  accountId: string | 'All'
  status: TransactionStatus | 'All'
  startDate?: string
  endDate?: string
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'merchant-asc'
}
