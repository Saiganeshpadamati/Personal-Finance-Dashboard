import React from 'react'
import {
  Utensils,
  ShoppingBag,
  Car,
  Tv,
  FileText,
  HeartPulse,
  GraduationCap,
  Plane,
  Coins,
  Smile,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  HelpCircle,
} from 'lucide-react'
import { BudgetWithProgress } from '../../types'
import { Card } from '../common/Card'
import { useAppSelector } from '../../app/hooks'
import { selectCurrency } from '../../features/preferences/preferencesSlice'
import { formatCurrency, formatPercentage } from '../../utils/currency'

interface BudgetCardProps {
  budget: BudgetWithProgress
  onEdit: (budget: BudgetWithProgress) => void
  onDelete: (budget: BudgetWithProgress) => void
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Food & Dining': <Utensils className="w-5 h-5 text-amber-500" />,
  Shopping: <ShoppingBag className="w-5 h-5 text-pink-500" />,
  Transportation: <Car className="w-5 h-5 text-cyan-500" />,
  Entertainment: <Tv className="w-5 h-5 text-purple-500" />,
  'Utilities & Bills': <FileText className="w-5 h-5 text-blue-500" />,
  Healthcare: <HeartPulse className="w-5 h-5 text-emerald-500" />,
  Education: <GraduationCap className="w-5 h-5 text-indigo-500" />,
  Travel: <Plane className="w-5 h-5 text-teal-500" />,
  Investments: <Coins className="w-5 h-5 text-green-500" />,
  'Personal Care': <Smile className="w-5 h-5 text-fuchsia-500" />,
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit, onDelete }) => {
  const currency = useAppSelector(selectCurrency)

  const isExceeded = budget.status === 'exceeded'
  const isWarning = budget.status === 'warning'

  let progressColor = 'bg-finflow-500'
  let badgeColor =
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/50'

  if (isExceeded) {
    progressColor = 'bg-rose-500'
    badgeColor =
      'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/50'
  } else if (isWarning) {
    progressColor = 'bg-amber-500'
    badgeColor =
      'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/50'
  }

  const icon = CATEGORY_ICONS[budget.category] || <HelpCircle className="w-5 h-5 text-slate-400" />

  return (
    <Card hover className="p-5 flex flex-col justify-between">
      <div>
        {/* Header: Category Icon, Title, Actions */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
              {icon}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {budget.category}
              </h4>
              <p className="text-[11px] text-slate-400">
                {budget.transactionCount} transactions this month
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(budget)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Limit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(budget)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
              title="Delete Budget"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Spent vs Limit Big Numbers */}
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Spent
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(budget.spentInPaise, currency, { decimals: 0 })}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Monthly Limit
            </span>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {formatCurrency(budget.limitInPaise, currency, { decimals: 0 })}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 space-y-1.5">
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">
              {formatPercentage(budget.percentageUsed, 1)} spent
            </span>
            <span
              className={`text-[11px] font-semibold ${
                budget.remainingInPaise >= 0
                  ? 'text-slate-600 dark:text-slate-300'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {budget.remainingInPaise >= 0
                ? `${formatCurrency(budget.remainingInPaise, currency, { decimals: 0 })} left`
                : `${formatCurrency(Math.abs(budget.remainingInPaise), currency, { decimals: 0 })} exceeded`}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Status Pill */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badgeColor}`}
        >
          {isExceeded && (
            <>
              <AlertTriangle className="w-3 h-3 mr-1 shrink-0" />
              Exceeded by {formatCurrency(Math.abs(budget.remainingInPaise), currency, { decimals: 0 })}
            </>
          )}
          {isWarning && !isExceeded && (
            <>
              <AlertTriangle className="w-3 h-3 mr-1 shrink-0" />
              Approaching limit ({budget.alertThresholdPercent ?? 80}%+)
            </>
          )}
          {!isExceeded && !isWarning && (
            <>
              <CheckCircle2 className="w-3 h-3 mr-1 shrink-0" />
              On Track
            </>
          )}
        </span>

        <span className="text-[11px] text-slate-400">Monthly</span>
      </div>
    </Card>
  )
}
