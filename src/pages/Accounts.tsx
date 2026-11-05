import React, { useState } from 'react'
import {
  Wallet,
  Building2,
  TrendingUp,
  CreditCard,
  ArrowLeftRight,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { AccountCard } from '../components/accounts/AccountCard'
import { TransferModal } from '../components/accounts/TransferModal'
import { useAppSelector } from '../app/hooks'
import {
  selectAllAccounts,
  selectNetWorthSummary,
} from '../features/accounts/accountsSlice'
import { selectAllTransactions } from '../features/transactions/transactionsSlice'
import { selectCurrency } from '../features/preferences/preferencesSlice'
import { formatCurrency } from '../utils/currency'
import { Account } from '../types'

export const AccountsPage: React.FC = () => {
  const [isTransferOpen, setIsTransferOpen] = useState(false)

  const accounts = useAppSelector(selectAllAccounts)
  const netWorth = useAppSelector(selectNetWorthSummary)
  const allTransactions = useAppSelector(selectAllTransactions)
  const currency = useAppSelector(selectCurrency)

  const handleOpenTransfer = (_acc?: Account) => {
    setIsTransferOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Disclaimer Notification */}
      <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block text-sm">
            Simulated Banking Environment
          </strong>
          <p className="mt-0.5 opacity-90 leading-relaxed">
            All accounts, institution names, balances, and card numbers are simulated for portfolio
            demonstration. Transfers execute atomically within the internal application ledger
            without real money movement or external banking API integration.
          </p>
        </div>
      </div>

      {/* Page Header & Transfer Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Accounts & Net Worth
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Holistic view of liquidity, long-term holdings, and credit facilities
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<ArrowLeftRight className="w-4 h-4" />}
          onClick={() => handleOpenTransfer()}
        >
          Transfer Funds
        </Button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Wallet className="w-4 h-4 text-finflow-500" />
            <span>Total Net Worth</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {formatCurrency(netWorth.totalNetWorthPaise, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Combined asset value</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Building2 className="w-4 h-4 text-sky-500" />
            <span>Liquid Cash</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {formatCurrency(netWorth.liquidCashPaise, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Checking & Savings</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Investments</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {formatCurrency(netWorth.investmentsPaise, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Demat & Mutual Funds</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <CreditCard className="w-4 h-4 text-rose-500" />
            <span>Credit Card Debt</span>
          </div>
          <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {formatCurrency(netWorth.creditDebtPaise, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Outstanding balance</div>
        </Card>
      </div>

      {/* Grid of Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {accounts.map((account) => {
          const accountTransactions = allTransactions.filter((t) => t.accountId === account.id)
          return (
            <AccountCard
              key={account.id}
              account={account}
              recentTransactions={accountTransactions}
              onTransfer={handleOpenTransfer}
            />
          )
        })}
      </div>

      {/* Transfer Modal */}
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
    </div>
  )
}

export default AccountsPage
