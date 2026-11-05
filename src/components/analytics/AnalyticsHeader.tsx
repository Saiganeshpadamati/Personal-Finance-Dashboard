import React from 'react'
import { TrendingUp, TrendingDown, Clock, Zap } from 'lucide-react'
import { Card } from '../common/Card'
import { useAppSelector } from '../../app/hooks'
import { selectCurrency } from '../../features/preferences/preferencesSlice'
import { formatCurrency } from '../../utils/currency'

export type AnalyticsTimeframe = '7d' | '30d' | '90d' | '12m'

interface AnalyticsHeaderProps {
  timeframe: AnalyticsTimeframe
  onTimeframeChange: (timeframe: AnalyticsTimeframe) => void
  totalIncome: number
  totalExpense: number
  dailyAvgSpend: number
  topCategory: { name: string; amount: number } | null
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  timeframe,
  onTimeframeChange,
  totalIncome,
  totalExpense,
  dailyAvgSpend,
  topCategory,
}) => {
  const currency = useAppSelector(selectCurrency)

  const timeframeOptions: { label: string; value: AnalyticsTimeframe }[] = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: '12 Months', value: '12m' },
  ]

  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Top Title & Period Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Financial Analytics & Intelligence
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dynamic cashflow trends, category burn rates, and algorithmic spending patterns
          </p>
        </div>

        {/* Timeframe pill selector */}
        <div className="flex items-center p-1 bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-xs self-start sm:self-auto">
          {timeframeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onTimeframeChange(opt.value)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                timeframe === opt.value
                  ? 'bg-finflow-600 text-white shadow-xs dark:bg-finflow-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Period Analytics KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Period Inflow</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalIncome, currency)}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
            {savingsRate.toFixed(0)}% retained as savings
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            <span>Period Outflow</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalExpense, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Total expenses in period
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-finflow-500" />
            <span>Avg Daily Spend</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(dailyAvgSpend, currency, { decimals: 0 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Estimated daily burn</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Top Category</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1 truncate">
            {topCategory ? topCategory.name : 'None'}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5 font-medium truncate">
            {topCategory ? formatCurrency(topCategory.amount, currency) : 'No spend'}
          </div>
        </Card>
      </div>
    </div>
  )
}
