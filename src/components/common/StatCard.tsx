import React from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { clsx } from 'clsx'
import { Card } from './Card'
import { formatCurrency, formatPercentage } from '../../utils/currency'
import { useAppSelector } from '../../app/hooks'
import { selectCurrency } from '../../features/preferences/preferencesSlice'

export interface StatCardProps {
  title: string
  amountInPaise: number
  changePercent?: number
  timeframeLabel?: string
  icon: React.ReactNode
  iconBgColor?: string
  isInverseTrend?: boolean // For expenses: spending more is negative/red, spending less is positive/green
  isCompact?: boolean
  prefix?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  amountInPaise,
  changePercent,
  timeframeLabel = 'vs last month',
  icon,
  iconBgColor = 'bg-finflow-50 text-finflow-600 dark:bg-finflow-950/80 dark:text-finflow-400',
  isInverseTrend = false,
}) => {
  const currentCurrency = useAppSelector(selectCurrency)

  // Trend color determination
  const hasChange = changePercent !== undefined && !isNaN(changePercent)
  const isPositive = hasChange && changePercent > 0
  const isNegative = hasChange && changePercent < 0
  const isNeutral = hasChange && Math.abs(changePercent) < 0.1

  let trendColor = 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400'
  if (hasChange && !isNeutral) {
    if (isInverseTrend) {
      trendColor = isPositive
        ? 'text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300'
        : 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300'
    } else {
      trendColor = isPositive
        ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300'
        : 'text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300'
    }
  }

  return (
    <Card hover className="p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {formatCurrency(amountInPaise, currentCurrency)}
          </h3>
        </div>
        <div className={clsx('p-3 rounded-xl flex items-center justify-center shrink-0', iconBgColor)}>
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-xs">
        {hasChange ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={clsx(
                'inline-flex items-center px-1.5 py-0.5 rounded-md font-semibold text-[11px]',
                trendColor
              )}
            >
              {isPositive && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
              {isNegative && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {isNeutral && <Minus className="w-3 h-3 mr-0.5" />}
              {isPositive ? '+' : ''}
              {formatPercentage(changePercent)}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">
              {timeframeLabel}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500">Live ledger calculation</span>
        )}
      </div>
    </Card>
  )
}
