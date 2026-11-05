import { z } from 'zod'

export const transactionCategoriesList = [
  'Salary',
  'Freelance',
  'Investments',
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Utilities & Bills',
  'Education',
  'Healthcare',
  'Travel',
  'Personal Care',
  'Transfer',
  'Other',
] as const

export const paymentMethodsList = [
  'UPI',
  'Net Banking',
  'Debit Card',
  'Credit Card',
  'Cash',
] as const

export const transactionFormSchema = z.object({
  merchant: z
    .string()
    .trim()
    .min(2, { message: 'Merchant name must be at least 2 characters' })
    .max(60, { message: 'Merchant name cannot exceed 60 characters' }),
  amount: z
    .number({ invalid_type_error: 'Amount must be a valid number' })
    .positive({ message: 'Amount must be greater than zero' })
    .max(10000000, { message: 'Amount exceeds maximum allowable limit (₹1 Crore)' }),
  type: z.enum(['income', 'expense']),
  category: z.enum(transactionCategoriesList),
  accountId: z.string().min(1, { message: 'Please select an account' }),
  date: z.string().min(1, { message: 'Please select a valid date' }),
  paymentMethod: z.enum(paymentMethodsList),
  description: z.string().max(200, { message: 'Description cannot exceed 200 characters' }),
  status: z.enum(['completed', 'pending', 'failed']),
})

export type TransactionFormData = z.infer<typeof transactionFormSchema>

export const budgetFormSchema = z.object({
  category: z.enum(transactionCategoriesList),
  limit: z
    .number({ invalid_type_error: 'Budget limit must be a number' })
    .positive({ message: 'Budget limit must be greater than ₹0' })
    .max(5000000, { message: 'Budget limit cannot exceed ₹50,00,000' }),
  period: z.literal('monthly'),
  alertThresholdPercent: z
    .number()
    .min(50, { message: 'Threshold must be at least 50%' })
    .max(100, { message: 'Threshold cannot exceed 100%' }),
})

export type BudgetFormData = z.infer<typeof budgetFormSchema>

export const transferFormSchema = z
  .object({
    sourceAccountId: z.string().min(1, { message: 'Please select a source account' }),
    destinationAccountId: z.string().min(1, { message: 'Please select a destination account' }),
    amount: z
      .number({ invalid_type_error: 'Transfer amount must be a number' })
      .positive({ message: 'Transfer amount must be greater than ₹0' }),
    description: z.string().max(100, { message: 'Note cannot exceed 100 characters' }),
  })
  .refine((data) => data.sourceAccountId !== data.destinationAccountId, {
    message: 'Destination account must be different from source account',
    path: ['destinationAccountId'],
  })

export type TransferFormData = z.infer<typeof transferFormSchema>

export const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  role: z.string().min(2, { message: 'Role or title is required' }),
})

export type ProfileFormData = z.infer<typeof profileFormSchema>
