import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  transactionFormSchema,
  TransactionFormData,
  transactionCategoriesList,
  paymentMethodsList,
} from '../../utils/validation'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addTransaction, editTransaction } from '../../features/transactions/transactionsSlice'
import { adjustAccountBalance, selectAllAccounts } from '../../features/accounts/accountsSlice'
import { Transaction } from '../../types'
import { paiseToRupees, rupeesToPaise } from '../../utils/currency'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData?: Transaction
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
}) => {
  const dispatch = useAppDispatch()
  const accounts = useAppSelector(selectAllAccounts)

  const defaultValues: Partial<TransactionFormData> = {
    merchant: '',
    amount: undefined as unknown as number,
    type: 'expense',
    category: 'Food & Dining',
    accountId: accounts[0]?.id || 'acc-1',
    date: new Date().toISOString().slice(0, 16),
    paymentMethod: 'UPI',
    description: '',
    status: 'completed',
  }

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues,
  })

  const currentType = watch('type')

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        reset({
          merchant: initialData.merchant,
          amount: paiseToRupees(initialData.amountInPaise),
          type: initialData.type,
          category: initialData.category,
          accountId: initialData.accountId,
          date: initialData.date.slice(0, 16),
          paymentMethod: initialData.paymentMethod,
          description: initialData.description || '',
          status: initialData.status,
        })
      } else {
        reset({
          ...defaultValues,
          date: new Date().toISOString().slice(0, 16),
          accountId: accounts[0]?.id || 'acc-1',
        })
      }
    }
  }, [isOpen, mode, initialData, reset, accounts])

  const onSubmit = (data: TransactionFormData) => {
    const amountInPaise = rupeesToPaise(data.amount)

    if (mode === 'create') {
      const newId = `tx-${Date.now()}`
      dispatch(
        addTransaction({
          id: newId,
          merchant: data.merchant,
          amountInPaise,
          type: data.type,
          category: data.category,
          accountId: data.accountId,
          date: data.date,
          paymentMethod: data.paymentMethod,
          description: data.description || '',
          status: data.status,
        })
      )

      // Automatically adjust target account balance
      dispatch(
        adjustAccountBalance({
          id: data.accountId,
          amountInPaise,
          isCredit: data.type === 'income',
        })
      )
    } else if (mode === 'edit' && initialData) {
      // If amount or type changed on edit, adjust account
      const oldAmount = initialData.amountInPaise
      const wasIncome = initialData.type === 'income'

      dispatch(
        editTransaction({
          id: initialData.id,
          merchant: data.merchant,
          amountInPaise,
          type: data.type,
          category: data.category,
          accountId: data.accountId,
          date: data.date,
          paymentMethod: data.paymentMethod,
          description: data.description || '',
          status: data.status,
        })
      )

      // Revert old transaction on account, apply new
      dispatch(
        adjustAccountBalance({
          id: initialData.accountId,
          amountInPaise: oldAmount,
          isCredit: !wasIncome,
        })
      )
      dispatch(
        adjustAccountBalance({
          id: data.accountId,
          amountInPaise,
          isCredit: data.type === 'income',
        })
      )
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add New Transaction' : 'Edit Transaction'}
      description="Record income or expenditure with automatic balance updates"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type selector toggle (Income vs Expense) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => reset({ ...watch(), type: 'expense' })}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                currentType === 'expense'
                  ? 'bg-white dark:bg-navy-900 text-rose-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => reset({ ...watch(), type: 'income' })}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                currentType === 'income'
                  ? 'bg-white dark:bg-navy-900 text-emerald-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Income (+)
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Amount (INR ₹) *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-sm">
              ₹
            </span>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('amount', { valueAsNumber: true })}
              className="w-full pl-8 pr-4 py-2 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
            />
          </div>
          {errors.amount && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.amount.message}</p>
          )}
        </div>

        {/* Merchant Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Merchant / Payee Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Swiggy, Amazon, Salary Deposit"
            {...register('merchant')}
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
          />
          {errors.merchant && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.merchant.message}</p>
          )}
        </div>

        {/* Category & Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category *
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
            >
              {transactionCategoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Method *
            </label>
            <select
              {...register('paymentMethod')}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
            >
              {paymentMethodsList.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Account & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Associated Account *
            </label>
            <select
              {...register('accountId')}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.accountNumberMasked})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              {...register('date')}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        {/* Note / Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Note / Description (Optional)
          </label>
          <input
            type="text"
            placeholder="Add optional context or tags"
            {...register('description')}
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
          />
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            {mode === 'create' ? 'Save Transaction' : 'Update Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
