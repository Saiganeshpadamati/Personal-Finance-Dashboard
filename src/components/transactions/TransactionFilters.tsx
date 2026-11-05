import React from 'react'
import { Search, RotateCcw } from 'lucide-react'
import { TransactionFilterOptions } from '../../types'
import { transactionCategoriesList } from '../../utils/validation'
import { useAppSelector } from '../../app/hooks'
import { selectAllAccounts } from '../../features/accounts/accountsSlice'

interface TransactionFiltersProps {
  filters: TransactionFilterOptions
  onFilterChange: (updated: Partial<TransactionFilterOptions>) => void
  onReset: () => void
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const accounts = useAppSelector(selectAllAccounts)

  const isFiltered =
    filters.searchQuery !== '' ||
    filters.category !== 'All' ||
    filters.type !== 'All' ||
    filters.accountId !== 'All' ||
    filters.sortBy !== 'date-desc'

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-card space-y-4">
      {/* Top Search & Reset Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by merchant name or note..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
          />
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {/* Type Filter */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ type: e.target.value as any })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
          >
            <option value="All">All Types</option>
            <option value="income">Income (+)</option>
            <option value="expense">Expense (-)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value as any })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
          >
            <option value="All">All Categories</option>
            {transactionCategoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Account Filter */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Account
          </label>
          <select
            value={filters.accountId}
            onChange={(e) => onFilterChange({ accountId: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
          >
            <option value="All">All Accounts</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Filter */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
          >
            <option value="date-desc">Date: Newest First</option>
            <option value="date-asc">Date: Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
            <option value="merchant-asc">Merchant: A-Z</option>
          </select>
        </div>
      </div>
    </div>
  )
}
