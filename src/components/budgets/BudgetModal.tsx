import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  budgetFormSchema,
  BudgetFormData,
  transactionCategoriesList,
} from '../../utils/validation'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { useAppDispatch } from '../../app/hooks'
import { addBudget, updateBudget } from '../../features/budgets/budgetsSlice'
import { Budget } from '../../types'
import { paiseToRupees, rupeesToPaise } from '../../utils/currency'

interface BudgetModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData?: Budget
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
}) => {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: 'Food & Dining',
      limit: undefined as unknown as number,
      period: 'monthly',
      alertThresholdPercent: 80,
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        reset({
          category: initialData.category,
          limit: paiseToRupees(initialData.limitInPaise),
          period: 'monthly',
          alertThresholdPercent: initialData.alertThresholdPercent ?? 80,
        })
      } else {
        reset({
          category: 'Food & Dining',
          limit: undefined as unknown as number,
          period: 'monthly',
          alertThresholdPercent: 80,
        })
      }
    }
  }, [isOpen, mode, initialData, reset])

  const onSubmit = (data: BudgetFormData) => {
    const limitInPaise = rupeesToPaise(data.limit)

    if (mode === 'create') {
      dispatch(
        addBudget({
          id: `b-${Date.now()}`,
          category: data.category,
          limitInPaise,
          period: 'monthly',
          alertThresholdPercent: data.alertThresholdPercent,
        })
      )
    } else if (mode === 'edit' && initialData) {
      dispatch(
        updateBudget({
          ...initialData,
          category: data.category,
          limitInPaise,
          alertThresholdPercent: data.alertThresholdPercent,
        })
      )
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create Budget Target' : 'Edit Budget Limit'}
      description="Set monthly spending boundaries and automated alert thresholds"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Category *
          </label>
          <select
            {...register('category')}
            disabled={mode === 'edit'}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white disabled:opacity-60"
          >
            {transactionCategoriesList
              .filter((c) => c !== 'Salary' && c !== 'Freelance' && c !== 'Transfer')
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>
          {errors.category && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.category.message}</p>
          )}
        </div>

        {/* Limit */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Monthly Limit (INR ₹) *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-sm">
              ₹
            </span>
            <input
              type="number"
              step="100"
              placeholder="e.g. 20000"
              {...register('limit', { valueAsNumber: true })}
              className="w-full pl-8 pr-4 py-2 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
            />
          </div>
          {errors.limit && <p className="text-[11px] text-rose-500 mt-1">{errors.limit.message}</p>}
        </div>

        {/* Alert Threshold */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Warning Threshold (% of limit)
          </label>
          <input
            type="number"
            min="50"
            max="100"
            placeholder="80"
            {...register('alertThresholdPercent', { valueAsNumber: true })}
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Trigger visual warnings when spending exceeds this percentage (default 80%).
          </p>
          {errors.alertThresholdPercent && (
            <p className="text-[11px] text-rose-500 mt-1">
              {errors.alertThresholdPercent.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            {mode === 'create' ? 'Create Budget' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
