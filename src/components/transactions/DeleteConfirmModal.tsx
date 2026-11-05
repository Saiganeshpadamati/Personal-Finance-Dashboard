import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Transaction } from '../../types'
import { formatCurrency } from '../../utils/currency'
import { useAppSelector } from '../../app/hooks'
import { selectCurrency } from '../../features/preferences/preferencesSlice'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  transaction: Transaction | null
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
}) => {
  const currency = useAppSelector(selectCurrency)

  if (!transaction) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Transaction"
      description="This action will permanently remove this record from your financial ledger."
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-rose-800 dark:text-rose-200 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <div>
            <span className="font-semibold">{transaction.merchant}</span>
            <div className="text-[11px] opacity-80">
              Amount:{' '}
              <span className="font-bold">
                {formatCurrency(transaction.amountInPaise, currency)}
              </span>{' '}
              ({transaction.type})
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Account balances and category monthly budget computations will automatically recalibrate
          to reflect this deletion.
        </p>

        <div className="pt-2 flex justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            Yes, Delete Record
          </Button>
        </div>
      </div>
    </Modal>
  )
}
