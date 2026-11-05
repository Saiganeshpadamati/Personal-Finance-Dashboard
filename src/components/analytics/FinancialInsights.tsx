import React from 'react'
import { Sparkles, TrendingUp, AlertCircle, Award, Compass } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card'
import { useAppSelector } from '../../app/hooks'
import { selectCurrency } from '../../features/preferences/preferencesSlice'
import { formatCurrency, formatPercentage } from '../../utils/currency'

interface FinancialInsightsProps {
  totalIncome: number
  totalExpense: number
  categoryData: { category: string; amountInPaise: number; percentage: number }[]
  transactionCount: number
  topCategory: { name: string; amount: number } | null
  timeframeLabel: string
}

export const FinancialInsights: React.FC<FinancialInsightsProps> = ({
  totalIncome,
  totalExpense,
  categoryData,
  transactionCount,
  topCategory,
  timeframeLabel,
}) => {
  const currency = useAppSelector(selectCurrency)

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-finflow-50 dark:bg-finflow-950/80 text-finflow-600 dark:text-finflow-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <CardTitle>Automated Financial Intelligence</CardTitle>
            <CardDescription>
              Algorithmic observations generated from {transactionCount} ledger events ({timeframeLabel})
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Insight 1: Savings Efficiency */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>High Savings Health ({formatPercentage(savingsRate, 0)})</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {savingsRate >= 30 ? (
              <>
                Outstanding cash retention! You are saving{' '}
                <strong className="text-slate-900 dark:text-white">
                  {formatPercentage(savingsRate)}
                </strong>{' '}
                of income, significantly exceeding the conventional 20% fintech benchmark.
              </>
            ) : savingsRate > 0 ? (
              <>
                You are currently saving{' '}
                <strong className="text-slate-900 dark:text-white">
                  {formatPercentage(savingsRate)}
                </strong>{' '}
                of total inflow. Consider trimming discretionary categories to push towards 30%.
              </>
            ) : (
              <>
                Expenses match or exceed inflow for this timeframe. Rebalance recurring
                subscriptions to protect reserve liquidity.
              </>
            )}
          </p>
        </div>

        {/* Insight 2: Category Concentration */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <span>Category Concentration</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {topCategory ? (
              <>
                <strong className="text-slate-900 dark:text-white">{topCategory.name}</strong> is
                your largest outflow center at{' '}
                <strong className="text-slate-900 dark:text-white">
                  {formatCurrency(topCategory.amount, currency)}
                </strong>{' '}
                ({((topCategory.amount / (totalExpense || 1)) * 100).toFixed(0)}% of total
                outflow).
              </>
            ) : (
              'Spending is evenly dispersed with no single category dominating.'
            )}
          </p>
        </div>

        {/* Insight 3: Discretionary vs Essential */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400">
            <Compass className="w-4 h-4 text-sky-500" />
            <span>Discretionary Burn</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Lifestyle spending (Dining, Entertainment, Shopping) represents{' '}
            <strong className="text-slate-900 dark:text-white">
              {categoryData
                .filter((c) => ['Food & Dining', 'Shopping', 'Entertainment'].includes(c.category))
                .reduce((acc, c) => acc + c.percentage, 0)
                .toFixed(0)}
              %
            </strong>{' '}
            of total outflows in this window.
          </p>
        </div>

        {/* Insight 4: Liquidity Guidance */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            <AlertCircle className="w-4 h-4 text-indigo-500" />
            <span>Revolut Portfolio Tip</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Automating recurring investments early in the month reduces impulsive spending and
            compound returns over a multi-year horizon.
          </p>
        </div>
      </div>
    </Card>
  )
}
