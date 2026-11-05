import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transferFormSchema, TransferFormData } from '../../utils/validation'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  selectAllAccounts,
  transferBetweenAccounts,
} from '../../features/accounts/accountsSlice'
import { addTransaction } from '../../features/transactions/transactionsSlice'
import { paiseToRupees, rupeesToPaise } from '../../utils/currency'

interface TransferModalProps {
  isOpen: boolean
  onClose: () => void
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch()
  const accounts = useAppSelector(selectAllAccounts)

  const activeAccounts = accounts.filter((a) => a.type !== 'credit')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      sourceAccountId: activeAccounts[0]?.id || '',
      destinationAccountId: activeAccounts[1]?.id || '',
      amount: undefined as unknown as number,
      description: 'Account Balance Transfer',
    },
  })

  React.useEffect(() => {
    if (isOpen) {
      reset({
        sourceAccountId: activeAccounts[0]?.id || '',
        destinationAccountId: activeAccounts[1]?.id || '',
        amount: undefined as unknown as number,
        description: 'Account Balance Transfer',
      })
    }
  }, [isOpen, reset])

  const onSubmit = (data: TransferFormData) => {
    const amountInPaise = rupeesToPaise(data.amount)
    const sourceAcc = accounts.find((a) => a.id === data.sourceAccountId)
    const destAcc = accounts.find((a) => a.id === data.destinationAccountId)

    const now = new Date().toISOString()

    // Dispatch atomic transfer on accounts slice
    dispatch(
      transferBetweenAccounts({
        sourceAccountId: data.sourceAccountId,
        destinationAccountId: data.destinationAccountId,
        amountInPaise,
        description: data.description || 'Internal Transfer',
        date: now,
      })
    )

    // Record source account debit transaction
    dispatch(
      addTransaction({
        id: `tx-${Date.now()}-out`,
        merchant: `Transfer to ${destAcc?.name || 'Account'}`,
        amountInPaise,
        type: 'expense',
        category: 'Transfer',
        accountId: data.sourceAccountId,
        date: now,
        paymentMethod: 'Net Banking',
        description: data.description || 'Internal Transfer',
        status: 'completed',
      })
    )

    // Record destination account credit transaction
    dispatch(
      addTransaction({
        id: `tx-${Date.now()}-in`,
        merchant: `Transfer from ${sourceAcc?.name || 'Account'}`,
        amountInPaise,
        type: 'income',
        category: 'Transfer',
        accountId: data.destinationAccountId,
        date: now,
        paymentMethod: 'Net Banking',
        description: data.description || 'Internal Transfer',
        status: 'completed',
      })
    )

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer Funds (Simulated)"
      description="Instantly move funds between your simulated financial accounts"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Source Account */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            From (Source Account) *
          </label>
          <select
            {...register('sourceAccountId')}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} — Balance: ₹{paiseToRupees(acc.balanceInPaise).toLocaleString('en-IN')}
              </option>
            ))}
          </select>
          {errors.sourceAccountId && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.sourceAccountId.message}</p>
          )}
        </div>

        {/* Destination Account */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            To (Destination Account) *
          </label>
          <select
            {...register('destinationAccountId')}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} — Balance: ₹{paiseToRupees(acc.balanceInPaise).toLocaleString('en-IN')}
              </option>
            ))}
          </select>
          {errors.destinationAccountId && (
            <p className="text-[11px] text-rose-500 mt-1">
              {errors.destinationAccountId.message}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Transfer Amount (INR ₹) *
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

        {/* Note / Reference */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Reference / Transfer Reason
          </label>
          <input
            type="text"
            placeholder="e.g. Monthly Savings allocation, Demat funding"
            {...register('description')}
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
          />
        </div>

        {/* Disclaimer Notice */}
        <div className="p-3 rounded-xl bg-finflow-50 dark:bg-finflow-950/40 border border-finflow-200/50 dark:border-finflow-800/40 text-[11px] text-finflow-700 dark:text-finflow-300">
          This transfer simulation executes immediately in your local ledger, recalculating account balances and generating corresponding audit entries.
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Execute Transfer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
