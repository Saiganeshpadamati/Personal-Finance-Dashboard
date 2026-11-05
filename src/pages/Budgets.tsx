import React, { useState } from 'react'
import { Plus, Target, AlertTriangle } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { EmptyState } from '../components/common/EmptyState'
import { BudgetCard } from '../components/budgets/BudgetCard'
import { BudgetSummary } from '../components/budgets/BudgetSummary'
import { BudgetModal } from '../components/budgets/BudgetModal'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  deleteBudget,
  selectBudgetsWithProgress,
} from '../features/budgets/budgetsSlice'
import { BudgetWithProgress } from '../types'

export const BudgetsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedBudget, setSelectedBudget] = useState<BudgetWithProgress | null>(null)
  const [budgetToDelete, setBudgetToDelete] = useState<BudgetWithProgress | null>(null)

  const dispatch = useAppDispatch()
  const budgets = useAppSelector(selectBudgetsWithProgress)

  const handleOpenCreate = () => {
    setSelectedBudget(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (budget: BudgetWithProgress) => {
    setSelectedBudget(budget)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (budgetToDelete) {
      dispatch(deleteBudget(budgetToDelete.id))
      setBudgetToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Monthly Category Budgets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Spending bounds automatically synced with real-time transaction ledger updates
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Create Budget
        </Button>
      </div>

      {/* Aggregate Overview Card */}
      <BudgetSummary />

      {/* Budgets Grid */}
      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={handleOpenEdit}
              onDelete={(b) => setBudgetToDelete(b)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Target className="w-6 h-6" />}
          title="No Budgets Configured"
          description="Create your first monthly category budget to enforce limits and receive early warning notifications."
          actionLabel="Create First Budget"
          onAction={handleOpenCreate}
        />
      )}

      {/* Add / Edit Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedBudget || undefined}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!budgetToDelete}
        onClose={() => setBudgetToDelete(null)}
        title="Delete Budget Category"
        description="Are you sure you want to remove this budget target?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-rose-800 dark:text-rose-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <span className="font-semibold">{budgetToDelete?.category}</span>
              <p className="text-[11px] opacity-80 mt-0.5">
                Past transactions in this category will remain intact.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <Button variant="outline" size="sm" onClick={() => setBudgetToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
              Yes, Delete Target
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default BudgetsPage
