import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card'
import { useAppSelector } from '../../app/hooks'
import { selectCurrency, selectTheme } from '../../features/preferences/preferencesSlice'
import { formatCompactCurrency, formatCurrency } from '../../utils/currency'

interface ComparisonPoint {
  label: string
  incomePaise: number
  expensePaise: number
}

interface IncomeExpenseBarChartProps {
  data: ComparisonPoint[]
  timeframeLabel: string
}

export const IncomeExpenseBarChart: React.FC<IncomeExpenseBarChartProps> = ({
  data,
  timeframeLabel,
}) => {
  const currency = useAppSelector(selectCurrency)
  const theme = useAppSelector(selectTheme)
  const isDark = theme === 'dark'

  const chartData = data.map((d) => ({
    name: d.label,
    income: d.incomePaise / 100,
    expense: d.expensePaise / 100,
    rawIncomePaise: d.incomePaise,
    rawExpensePaise: d.expensePaise,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xl text-xs space-y-1.5">
          <p className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
            {label}
          </p>
          <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400">
            <span>Income:</span>
            <span className="font-bold">
              {formatCurrency(payload[0]?.payload?.rawIncomePaise || 0, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-rose-600 dark:text-rose-400">
            <span>Expenses:</span>
            <span className="font-bold">
              {formatCurrency(payload[1]?.payload?.rawExpensePaise || 0, currency)}
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
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>Comparative inflow and outflow volume ({timeframeLabel})</CardDescription>
        </div>
      </CardHeader>

      <div className="p-6 pt-2 h-72 sm:h-80 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No transactions found
          </div>
        )}
      </div>
    </Card>
  )
}
