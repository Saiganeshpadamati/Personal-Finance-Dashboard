import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card'
import { useAppSelector } from '../../app/hooks'
import { selectCashFlowHistory } from '../../features/transactions/transactionsSlice'
import { selectCurrency, selectTheme } from '../../features/preferences/preferencesSlice'
import { formatCompactCurrency, paiseToRupees } from '../../utils/currency'

export const CashFlowChart: React.FC = () => {
  const cashFlowHistory = useAppSelector(selectCashFlowHistory)
  const currency = useAppSelector(selectCurrency)
  const theme = useAppSelector(selectTheme)

  const isDark = theme === 'dark'

  const chartData = cashFlowHistory.map((item) => ({
    name: item.label,
    income: paiseToRupees(item.incomePaise),
    expense: paiseToRupees(item.expensePaise),
    savings: paiseToRupees(item.savingsPaise),
    rawIncomePaise: item.incomePaise,
    rawExpensePaise: item.expensePaise,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xl text-xs space-y-1.5">
          <p className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
            {label} 2026
          </p>
          <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Income:
            </span>
            <span className="font-bold">
              {formatCompactCurrency((payload[0]?.value || 0) * 100, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-rose-600 dark:text-rose-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Expenses:
            </span>
            <span className="font-bold">
              {formatCompactCurrency((payload[1]?.value || 0) * 100, currency)}
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Cash Flow Overview</CardTitle>
          <CardDescription>Monthly income vs expense trajectory over the last 6 months</CardDescription>
        </div>
      </CardHeader>

      <div className="p-6 pt-4 h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#1e293b' : '#f1f5f9'}
              vertical={false}
            />

            <XAxis
              dataKey="name"
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCompactCurrency(v * 100, currency)}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
            />

            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#incomeGradient)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expenses"
              stroke="#f43f5e"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
