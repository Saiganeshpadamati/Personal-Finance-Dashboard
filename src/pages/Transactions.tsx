import React, { useState, useMemo } from 'react'
import { Plus, Download } from 'lucide-react'
import { Button } from '../components/common/Button'
import { TransactionFilters } from '../components/transactions/TransactionFilters'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { TransactionModal } from '../components/transactions/TransactionModal'
import { DeleteConfirmModal } from '../components/transactions/DeleteConfirmModal'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  deleteTransaction,
  selectFilteredTransactions,
} from '../features/transactions/transactionsSlice'
import { adjustAccountBalance } from '../features/accounts/accountsSlice'
import { selectCurrency } from '../features/preferences/preferencesSlice'
import { Transaction, TransactionFilterOptions } from '../types'
import { formatCurrency } from '../utils/currency'
import { exportTransactionsToCSV } from '../utils/export'

const initialFilters: TransactionFilterOptions = {
  searchQuery: '',
  category: 'All',
  type: 'All',
  accountId: 'All',
  status: 'All',
  sortBy: 'date-desc',
}

export const TransactionsPage: React.FC = () => {
  const [filters, setFilters] = useState<TransactionFilterOptions>(initialFilters)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null)

  const dispatch = useAppDispatch()
  const currency = useAppSelector(selectCurrency)

  const filteredTransactions = useAppSelector((state) =>
    selectFilteredTransactions(state, filters)
  )

  const handleFilterChange = (updated: Partial<TransactionFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
  }

  const handleResetFilters = () => {
    setFilters(initialFilters)
  }

  const handleOpenCreate = () => {
    setSelectedTx(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (tx: Transaction) => {
    setSelectedTx(tx)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (txToDelete) {
      dispatch(deleteTransaction(txToDelete.id))
      // Revert transaction impact on associated account
      dispatch(
        adjustAccountBalance({
          id: txToDelete.accountId,
          amountInPaise: txToDelete.amountInPaise,
          isCredit: txToDelete.type === 'expense', // if it was expense, refund back
        })
      )
      setTxToDelete(null)
    }
  }

  // Aggregate stats for current filtered ledger view
  const { totalIncomePaise, totalExpensePaise, netCashflowPaise } = useMemo(() => {
    let income = 0
    let expense = 0
    filteredTransactions.forEach((t) => {
      if (t.type === 'income') income += t.amountInPaise
      else if (t.type === 'expense') expense += t.amountInPaise
    })
    return {
      totalIncomePaise: income,
      totalExpensePaise: expense,
      netCashflowPaise: income - expense,
    }
  }, [filteredTransactions])

  return (
    <div className="space-y-6">
      {/* Page Header with Action CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Transaction Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit, filter, and record financial flows with type-safe precision
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => exportTransactionsToCSV(filteredTransactions)}
          >
            Export Filtered CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreate}
          >
            New Transaction
          </Button>
        </div>
      </div>

      {/* Filtered View Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div>
          <div className="text-[11px] text-slate-400 font-medium">Matching Entries</div>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            {filteredTransactions.length}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-medium">Filtered Income</div>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            +{formatCurrency(totalIncomePaise, currency)}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-medium">Filtered Expenses</div>
          <div className="text-base font-bold text-rose-600 dark:text-rose-400 mt-0.5">
            -{formatCurrency(totalExpensePaise, currency)}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-medium">Filtered Net Flow</div>
          <div
            className={`text-base font-bold mt-0.5 ${
              netCashflowPaise >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {netCashflowPaise >= 0 ? '+' : ''}
            {formatCurrency(netCashflowPaise, currency)}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <TransactionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Main Ledger Table */}
      <TransactionTable
        transactions={filteredTransactions}
        onEdit={handleOpenEdit}
        onDelete={(tx) => setTxToDelete(tx)}
        onAddFirst={handleOpenCreate}
      />

      {/* Modals */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedTx || undefined}
      />

      <DeleteConfirmModal
        isOpen={!!txToDelete}
        onClose={() => setTxToDelete(null)}
        onConfirm={handleConfirmDelete}
        transaction={txToDelete}
      />
    </div>
  )
}

export default TransactionsPage
