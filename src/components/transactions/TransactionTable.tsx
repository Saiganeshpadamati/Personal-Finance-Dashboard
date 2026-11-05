import React, { useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Receipt,
} from 'lucide-react'
import { Transaction } from '../../types'
import { CategoryBadge, StatusBadge } from '../common/Badge'
import { EmptyState } from '../common/EmptyState'
import { useAppSelector } from '../../app/hooks'
import { selectAllAccounts } from '../../features/accounts/accountsSlice'
import { selectCurrency } from '../../features/preferences/preferencesSlice'
import { formatCurrency } from '../../utils/currency'
import { formatFriendlyDate } from '../../utils/date'

interface TransactionTableProps {
  transactions: Transaction[]
  onEdit: (tx: Transaction) => void
  onDelete: (tx: Transaction) => void
  onAddFirst: () => void
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
  onAddFirst,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const accounts = useAppSelector(selectAllAccounts)
  const currency = useAppSelector(selectCurrency)

  const getAccountName = (accId: string) => {
    const acc = accounts.find((a) => a.id === accId)
    return acc ? acc.name : 'Unknown Account'
  }

  // Pagination calculation
  const totalItems = transactions.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedTransactions = transactions.slice(startIndex, endIndex)

  if (totalItems === 0) {
    return (
      <EmptyState
        icon={<Receipt className="w-6 h-6" />}
        title="No transactions found"
        description="No transaction records match your active search or filter criteria. Try adjusting filters or create a new transaction."
        actionLabel="Create Transaction"
        onAction={onAddFirst}
      />
    )
  }

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-card overflow-hidden">
      {/* Table responsive wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-3.5">Merchant & Details</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Account</th>
              <th className="px-4 py-3.5">Date</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Amount</th>
              <th className="px-4 py-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {paginatedTransactions.map((tx) => {
              const isIncome = tx.type === 'income'
              return (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-850/40 transition-colors group"
                >
                  {/* Merchant & Description */}
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
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
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {tx.merchant}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {tx.paymentMethod} {tx.description ? `• ${tx.description}` : ''}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <CategoryBadge category={tx.category} />
                  </td>

                  {/* Account */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                    {getAccountName(tx.accountId)}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {formatFriendlyDate(tx.date)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={tx.status} />
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-3.5 text-right whitespace-nowrap">
                    <span
                      className={`font-bold text-sm ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amountInPaise, currency)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onEdit(tx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Transaction"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(tx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                        title="Delete Transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="text-slate-800 dark:text-white">{startIndex + 1}</strong> to{' '}
            <strong className="text-slate-800 dark:text-white">{endIndex}</strong> of{' '}
            <strong className="text-slate-800 dark:text-white">{totalItems}</strong> entries
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px]">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Page Nav Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Page {safePage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
