import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card'
import { useAppSelector } from '../../app/hooks'
import {
  selectBudgetsWithProgress,
  selectOverallBudgetSummary,
} from '../../features/budgets/budgetsSlice'
import { selectCurrency } from '../../features/preferences/preferencesSlice'
import { formatCurrency, formatPercentage } from '../../utils/currency'

export const BudgetProgressWidget: React.FC = () => {
  const budgets = useAppSelector(selectBudgetsWithProgress)
  const summary = useAppSelector(selectOverallBudgetSummary)
  const currency = useAppSelector(selectCurrency)

  // Show top 4 budgets
  const topBudgets = budgets.slice(0, 4)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Budget Health</CardTitle>
          <CardDescription>
            {summary.overallPercentageUsed.toFixed(0)}% overall monthly budget consumed
          </CardDescription>
        </div>
        <Link
          to="/budgets"
          className="text-xs font-semibold text-finflow-600 dark:text-finflow-400 hover:underline flex items-center gap-1"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <div className="p-6 space-y-4">
        {topBudgets.map((budget) => {
          const isExceeded = budget.status === 'exceeded'
          const isWarning = budget.status === 'warning'

          let barColor = 'bg-finflow-500'
          if (isExceeded) barColor = 'bg-rose-500'
          else if (isWarning) barColor = 'bg-amber-500'

          return (
            <div key={budget.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {budget.category}
                  </span>
                  {isExceeded && (
                    <span className="inline-flex items-center text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded">
                      <AlertTriangle className="w-3 h-3 mr-0.5" /> Exceeded
                    </span>
                  )}
                  {isWarning && !isExceeded && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded">
                      Near Limit
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(budget.spentInPaise, currency, { decimals: 0 })}
                  </span>
                  <span className="text-slate-400">
                    {' / '}
                    {formatCurrency(budget.limitInPaise, currency, { decimals: 0 })}
                  </span>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                  style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{formatPercentage(budget.percentageUsed, 0)} utilized</span>
                <span>
                  {budget.remainingInPaise >= 0
                    ? `${formatCurrency(budget.remainingInPaise, currency, { decimals: 0 })} left`
                    : `${formatCurrency(Math.abs(budget.remainingInPaise), currency, { decimals: 0 })} over`}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
