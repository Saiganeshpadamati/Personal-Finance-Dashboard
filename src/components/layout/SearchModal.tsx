import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { useAppSelector } from '../../app/hooks'
import { selectAllTransactions } from '../../features/transactions/transactionsSlice'
import { selectCurrency } from '../../features/preferences/preferencesSlice'
import { formatCurrency } from '../../utils/currency'
import { formatFriendlyDate } from '../../utils/date'
import { CategoryBadge } from '../common/Badge'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const transactions = useAppSelector(selectAllTransactions)
  const currency = useAppSelector(selectCurrency)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const filtered = query.trim()
    ? transactions
        .filter(
          (t) =>
            t.merchant.toLowerCase().includes(query.toLowerCase()) ||
            (t.description || '').toLowerCase().includes(query.toLowerCase()) ||
            t.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
    : []

  const handleSelect = () => {
    navigate('/transactions')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-start justify-center pt-20 px-4 text-center sm:p-0">
        <div
          className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-navy-900 text-left shadow-2xl transition-all w-full max-w-xl border border-slate-200 dark:border-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Bar */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search merchants, categories, or descriptions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-2">
            {query.trim() === '' ? (
              <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
                Type something to search transactions across your entire financial ledger
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                No matching transactions found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <div className="space-y-1">
                {filtered.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={handleSelect}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          tx.type === 'income'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {tx.type === 'income' ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {tx.merchant}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                          <CategoryBadge category={tx.category} />
                          <span>•</span>
                          <span>{formatFriendlyDate(tx.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-bold ${
                          tx.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatCurrency(tx.amountInPaise, currency)}
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize">{tx.paymentMethod}</div>
                    </div>
                  </div>
                ))}

                <div
                  onClick={handleSelect}
                  className="p-3 text-center text-xs font-medium text-finflow-600 dark:text-finflow-400 hover:underline flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View all transactions matching in ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
