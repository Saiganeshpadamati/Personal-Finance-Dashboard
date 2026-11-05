import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card'
import { CategoryBadge, StatusBadge } from '../common/Badge'
import { useAppSelector } from '../../app/hooks'
import { selectAllTransactions } from '../../features/transactions/transactionsSlice'
import { selectCurrency } from '../../features/preferences/preferencesSlice'
import { formatCurrency } from '../../utils/currency'
import { formatFriendlyDate } from '../../utils/date'

export const RecentTransactions: React.FC = () => {
  const transactions = useAppSelector(selectAllTransactions)
  const currency = useAppSelector(selectCurrency)

  // Top 5 transactions sorted by date descending
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest financial activity across your registered accounts</CardDescription>
        </div>
        <Link
          to="/transactions"
          className="text-xs font-semibold text-finflow-600 dark:text-finflow-400 hover:underline flex items-center gap-1"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-3">Merchant / Payee</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {recent.map((tx) => {
              const isIncome = tx.type === 'income'
              return (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {tx.merchant}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {tx.paymentMethod} • {tx.description || 'Ledger entry'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <CategoryBadge category={tx.category} />
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatFriendlyDate(tx.date)}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="px-6 py-3.5 text-right whitespace-nowrap">
                    <span
                      className={`font-bold ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amountInPaise, currency)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
