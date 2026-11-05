import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card'
import { useAppSelector } from '../../app/hooks'
import { selectCurrency, selectTheme } from '../../features/preferences/preferencesSlice'
import { formatCompactCurrency, formatCurrency } from '../../utils/currency'

interface SpendingTrendPoint {
  dateLabel: string
  amountInPaise: number
}

interface SpendingTrendChartProps {
  data: SpendingTrendPoint[]
  timeframeLabel: string
}

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({
  data,
  timeframeLabel,
}) => {
  const currency = useAppSelector(selectCurrency)
  const theme = useAppSelector(selectTheme)
  const isDark = theme === 'dark'

  const chartData = data.map((d) => ({
    name: d.dateLabel,
    amount: d.amountInPaise / 100,
    rawPaise: d.amountInPaise,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xl text-xs space-y-1">
          <p className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
            {label}
          </p>
          <div className="flex items-center justify-between gap-4 text-finflow-600 dark:text-finflow-400">
            <span>Expenses:</span>
            <span className="font-bold">
              {formatCurrency(payload[0]?.payload?.rawPaise || 0, currency)}
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
          <CardTitle>Spending Velocity Trend</CardTitle>
          <CardDescription>Expenditure curve for the selected {timeframeLabel}</CardDescription>
        </div>
      </CardHeader>

      <div className="p-6 pt-2 h-72 sm:h-80 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="spendVelocityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0e8ce4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0e8ce4" stopOpacity={0.0} />
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

              <Area
                type="monotone"
                dataKey="amount"
                name="Spending"
                stroke="#0e8ce4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#spendVelocityGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No spending data in this timeframe
          </div>
        )}
      </div>
    </Card>
  )
}
