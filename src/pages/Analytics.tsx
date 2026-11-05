import React, { useState, useMemo } from 'react'
import {
  AnalyticsHeader,
  AnalyticsTimeframe,
} from '../components/analytics/AnalyticsHeader'
import { SpendingTrendChart } from '../components/analytics/SpendingTrendChart'
import { IncomeExpenseBarChart } from '../components/analytics/IncomeExpenseBarChart'
import { FinancialInsights } from '../components/analytics/FinancialInsights'
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card'
import { useAppSelector } from '../app/hooks'
import { selectAllTransactions } from '../features/transactions/transactionsSlice'
import { selectCurrency } from '../features/preferences/preferencesSlice'
import { formatCurrency, formatPercentage } from '../utils/currency'

export const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>('30d')
  const transactions = useAppSelector(selectAllTransactions)
  const currency = useAppSelector(selectCurrency)

  // Reference date is latest transaction or today
  const refDate = useMemo(() => {
    if (transactions.length === 0) return new Date()
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    return new Date(sorted[0].date)
  }, [transactions])

  // Filter transactions according to selected timeframe
  const {
    periodTransactions,
    daysInPeriod,
    timeframeLabel,
    trendData,
    comparisonData,
    categoryBreakdown,
    totalIncome,
    totalExpense,
    topCategory,
  } = useMemo(() => {
    let days = 30
    let label = 'last 30 days'

    if (timeframe === '7d') {
      days = 7
      label = 'last 7 days'
    } else if (timeframe === '30d') {
      days = 30
      label = 'last 30 days'
    } else if (timeframe === '90d') {
      days = 90
      label = 'last 90 days'
    } else if (timeframe === '12m') {
      days = 365
      label = 'last 12 months'
    }

    const cutoff = new Date(refDate.getTime() - days * 24 * 60 * 60 * 1000)

    const filtered = transactions.filter((tx) => {
      const txDate = new Date(tx.date)
      return txDate >= cutoff && txDate <= refDate
    })

    let income = 0
    let expense = 0
    const catMap = new Map<string, number>()

    filtered.forEach((tx) => {
      if (tx.type === 'income') {
        income += tx.amountInPaise
      } else if (tx.type === 'expense') {
        expense += tx.amountInPaise
        catMap.set(tx.category, (catMap.get(tx.category) || 0) + tx.amountInPaise)
      }
    })

    // Sorted categories
    const categories = Array.from(catMap.entries())
      .map(([cat, amt]) => ({
        category: cat,
        amountInPaise: amt,
        percentage: expense > 0 ? (amt / expense) * 100 : 0,
      }))
      .sort((a, b) => b.amountInPaise - a.amountInPaise)

    const top = categories[0]
      ? { name: categories[0].category, amount: categories[0].amountInPaise }
      : null

    // Generate trend and comparison points based on timeframe
    let trendPoints: { dateLabel: string; amountInPaise: number }[] = []
    let compPoints: { label: string; incomePaise: number; expensePaise: number }[] = []

    if (timeframe === '7d') {
      // 7 individual days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(refDate.getTime() - i * 24 * 60 * 60 * 1000)
        const dateKey = d.toISOString().slice(0, 10)
        const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short' })

        let dayExp = 0
        let dayInc = 0

        filtered.forEach((tx) => {
          if (tx.date.startsWith(dateKey)) {
            if (tx.type === 'expense') dayExp += tx.amountInPaise
            else if (tx.type === 'income') dayInc += tx.amountInPaise
          }
        })

        trendPoints.push({ dateLabel: dayLabel, amountInPaise: dayExp })
        compPoints.push({ label: dayLabel, incomePaise: dayInc, expensePaise: dayExp })
      }
    } else if (timeframe === '30d') {
      // 6 buckets of 5 days
      const bucketSize = 5
      for (let i = 5; i >= 0; i--) {
        const bStart = new Date(refDate.getTime() - (i + 1) * bucketSize * 24 * 60 * 60 * 1000)
        const bEnd = new Date(refDate.getTime() - i * bucketSize * 24 * 60 * 60 * 1000)
        const bLabel = `${bStart.getDate()}-${bEnd.getDate()} ${bEnd.toLocaleDateString('en-IN', {
          month: 'short',
        })}`

        let bExp = 0
        let bInc = 0

        filtered.forEach((tx) => {
          const t = new Date(tx.date)
          if (t >= bStart && t <= bEnd) {
            if (tx.type === 'expense') bExp += tx.amountInPaise
            else if (tx.type === 'income') bInc += tx.amountInPaise
          }
        })

        trendPoints.push({ dateLabel: bLabel, amountInPaise: bExp })
        compPoints.push({ label: bLabel, incomePaise: bInc, expensePaise: bExp })
      }
    } else if (timeframe === '90d') {
      // 3 monthly blocks
      for (let i = 2; i >= 0; i--) {
        const d = new Date(refDate.getFullYear(), refDate.getMonth() - i, 1)
        const mLabel = d.toLocaleDateString('en-IN', { month: 'short' })
        const yr = d.getFullYear()
        const mo = d.getMonth()

        let mExp = 0
        let mInc = 0

        filtered.forEach((tx) => {
          const t = new Date(tx.date)
          if (t.getFullYear() === yr && t.getMonth() === mo) {
            if (tx.type === 'expense') mExp += tx.amountInPaise
            else if (tx.type === 'income') mInc += tx.amountInPaise
          }
        })

        trendPoints.push({ dateLabel: mLabel, amountInPaise: mExp })
        compPoints.push({ label: mLabel, incomePaise: mInc, expensePaise: mExp })
      }
    } else {
      // 12 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date(refDate.getFullYear(), refDate.getMonth() - i, 1)
        const mLabel = d.toLocaleDateString('en-IN', { month: 'short' })
        const yr = d.getFullYear()
        const mo = d.getMonth()

        let mExp = 0
        let mInc = 0

        filtered.forEach((tx) => {
          const t = new Date(tx.date)
          if (t.getFullYear() === yr && t.getMonth() === mo) {
            if (tx.type === 'expense') mExp += tx.amountInPaise
            else if (tx.type === 'income') mInc += tx.amountInPaise
          }
        })

        trendPoints.push({ dateLabel: mLabel, amountInPaise: mExp })
        compPoints.push({ label: mLabel, incomePaise: mInc, expensePaise: mExp })
      }
    }

    return {
      periodTransactions: filtered,
      daysInPeriod: days,
      timeframeLabel: label,
      trendData: trendPoints,
      comparisonData: compPoints,
      categoryBreakdown: categories,
      totalIncome: income,
      totalExpense: expense,
      topCategory: top,
    }
  }, [transactions, refDate, timeframe])

  const dailyAvg = daysInPeriod > 0 ? Math.round(totalExpense / daysInPeriod) : 0

  return (
    <div className="space-y-6">
      {/* Timeframe & Summary Header */}
      <AnalyticsHeader
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        dailyAvgSpend={dailyAvg}
        topCategory={topCategory}
      />

      {/* Primary Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingTrendChart data={trendData} timeframeLabel={timeframeLabel} />
        <IncomeExpenseBarChart data={comparisonData} timeframeLabel={timeframeLabel} />
      </div>

      {/* Category Breakdown Progress Strip */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Category Concentration Breakdown</CardTitle>
            <CardDescription>
              Volume and relative share of expenses across all sectors ({timeframeLabel})
            </CardDescription>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {categoryBreakdown.length} Active Categories
          </span>
        </CardHeader>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {categoryBreakdown.map((item) => (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {item.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">
                    {formatPercentage(item.percentage)}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(item.amountInPaise, currency)}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-finflow-500"
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Rule-Based Financial Insights */}
      <FinancialInsights
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        categoryData={categoryBreakdown}
        transactionCount={periodTransactions.length}
        topCategory={topCategory}
        timeframeLabel={timeframeLabel}
      />
    </div>
  )
}

export default AnalyticsPage
