import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card'
import { useAppSelector } from '../../app/hooks'
import { selectCurrentMonthCategorySpending } from '../../features/transactions/transactionsSlice'
import { selectCurrency } from '../../features/preferences/preferencesSlice'
import { formatCompactCurrency, formatCurrency } from '../../utils/currency'

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#f59e0b', // amber
  Shopping: '#ec4899', // pink
  Transportation: '#06b6d4', // cyan
  Entertainment: '#8b5cf6', // purple
  'Utilities & Bills': '#3b82f6', // blue
  Healthcare: '#10b981', // emerald
  Education: '#6366f1', // indigo
  Travel: '#14b8a6', // teal
  Investments: '#22c55e', // green
  'Personal Care': '#d946ef', // fuchsia
  Other: '#64748b', // slate
}

export const CategoryPieChart: React.FC = () => {
  const { totalExpenseInPaise, categories } = useAppSelector(
    selectCurrentMonthCategorySpending
  )
  const currency = useAppSelector(selectCurrency)

  const chartData = categories.map((cat) => ({
    name: cat.category,
    value: cat.amountInPaise,
    percentage: cat.percentage,
    color: CATEGORY_COLORS[cat.category] || '#94a3b8',
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xl text-xs space-y-1">
          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            {data.name}
          </p>
          <p className="font-bold text-slate-800 dark:text-slate-200">
            {formatCurrency(data.value, currency)}
          </p>
          <p className="text-slate-400 text-[11px]">
            {data.percentage.toFixed(1)}% of total spending
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Current month expense distribution</CardDescription>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {formatCompactCurrency(totalExpenseInPaise, currency)} Total
        </span>
      </CardHeader>

      <div className="p-6 pt-2 flex flex-col sm:flex-row items-center gap-6">
        {/* Donut Chart */}
        <div className="w-full sm:w-1/2 h-56 relative flex items-center justify-center">
          {chartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] text-slate-400 font-medium">Expenses</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatCompactCurrency(totalExpenseInPaise, currency)}
                </span>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-400 text-center">No expenses recorded</div>
          )}
        </div>

        {/* Category List Breakdown */}
        <div className="w-full sm:w-1/2 space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {chartData.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-slate-400 text-[11px]">{cat.percentage.toFixed(1)}%</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCompactCurrency(cat.value, currency)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
