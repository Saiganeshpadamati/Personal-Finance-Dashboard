export type AccountType = 'savings' | 'checking' | 'credit' | 'investment'

export type AccountStatus = 'active' | 'frozen'

export interface Account {
  id: string
  name: string
  type: AccountType
  institution: string
  balanceInPaise: number // Integer in paise
  creditLimitInPaise?: number
  accountNumberMasked: string
  currency: string
  status: AccountStatus
  color: string // Tailwind color class or hex for visual differentiation
}

export interface AccountTransferPayload {
  sourceAccountId: string
  destinationAccountId: string
  amountInPaise: number
  description: string
  date: string
}
