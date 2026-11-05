import React from 'react'
import { Target, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { Card } from '../common/Card'
import { useAppSelector } from '../../app/hooks'
import { selectOverallBudgetSummary } from '../../features/budgets/budgetsSlice'
import { selectCurrency } from '../../features/preferences/preferencesSlice'
import { formatCurrency, formatPercentage } from '../../utils/currency'

export const BudgetSummary: React.FC = () => {
  const summary = useAppSelector(selectOverallBudgetSummary)
  const currency = useAppSelector(selectCurrency)

  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Overall Big Numbers */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-finflow-50 dark:bg-finflow-950/80 text-finflow-600 dark:text-finflow-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Budget Health
              </h3>
              <p className="text-xs text-slate-400">
                {summary.budgetCount} categories monitored for the current cycle
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-4 pt-2">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Total Allocated
              </span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(summary.totalLimitInPaise, currency, { decimals: 0 })}
              </div>
            </div>

            <div className="border-l border-slate-200 dark:border-slate-800 pl-4">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Total Spent
              </span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(summary.totalSpentInPaise, currency, { decimals: 0 })}
              </div>
            </div>

            <div className="border-l border-slate-200 dark:border-slate-800 pl-4">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Remaining
              </span>
              <div
                className={`text-2xl font-extrabold ${
                  summary.totalRemainingInPaise >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {formatCurrency(summary.totalRemainingInPaise, currency, { decimals: 0 })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Health Metrics and Global Bar */}
        <div className="lg:w-96 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Overall Budget Velocity
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatPercentage(summary.overallPercentageUsed, 1)}
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                summary.overallPercentageUsed >= 100
                  ? 'bg-rose-500'
                  : summary.overallPercentageUsed >= 80
                  ? 'bg-amber-500'
                  : 'bg-finflow-500'
              }`}
              style={{ width: `${Math.min(summary.overallPercentageUsed, 100)}%` }}
            />
          </div>

          {/* Pill stats */}
          <div className="flex items-center gap-3 pt-1 text-xs">
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {summary.onTrackCount} On Track
            </span>
            {summary.warningCount > 0 && (
              <span className="inline-flex items-center text-amber-600 dark:text-amber-400 font-semibold gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {summary.warningCount} Near Limit
              </span>
            )}
            {summary.exceededCount > 0 && (
              <span className="inline-flex items-center text-rose-600 dark:text-rose-400 font-semibold gap-1">
                <XCircle className="w-3.5 h-3.5" />
                {summary.exceededCount} Exceeded
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
