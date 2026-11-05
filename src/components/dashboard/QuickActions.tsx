import React, { useState } from 'react'
import { PlusCircle, ArrowLeftRight, Target, Download } from 'lucide-react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { TransactionModal } from '../transactions/TransactionModal'
import { TransferModal } from '../accounts/TransferModal'
import { BudgetModal } from '../budgets/BudgetModal'
import { useAppSelector } from '../../app/hooks'
import { selectAllTransactions } from '../../features/transactions/transactionsSlice'
import { exportTransactionsToCSV } from '../../utils/export'

export const QuickActions: React.FC = () => {
  const [isAddTxOpen, setIsAddTxOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isBudgetOpen, setIsBudgetOpen] = useState(false)

  const transactions = useAppSelector(selectAllTransactions)

  const handleExportCSV = () => {
    exportTransactionsToCSV(transactions)
  }

  return (
    <>
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Quick Financial Actions
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instant operations across simulated ledger accounts
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="primary"
              size="sm"
              icon={<PlusCircle className="w-4 h-4" />}
              onClick={() => setIsAddTxOpen(true)}
            >
              Add Transaction
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowLeftRight className="w-4 h-4" />}
              onClick={() => setIsTransferOpen(true)}
            >
              Quick Transfer
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={<Target className="w-4 h-4" />}
              onClick={() => setIsBudgetOpen(true)}
            >
              Set Budget
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <TransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        mode="create"
      />
      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
      />
      <BudgetModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        mode="create"
      />
    </>
  )
}
