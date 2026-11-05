import React from 'react'
import {
  Building2,
  CreditCard,
  TrendingUp,
  Wallet,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { Account, Transaction } from '../../types'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { useAppSelector } from '../../app/hooks'
import { selectCurrency } from '../../features/preferences/preferencesSlice'
import { formatCurrency } from '../../utils/currency'
import { formatFriendlyDate } from '../../utils/date'

interface AccountCardProps {
  account: Account
  recentTransactions: Transaction[]
  onTransfer: (account: Account) => void
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  recentTransactions,
  onTransfer,
}) => {
  const currency = useAppSelector(selectCurrency)

  const isCredit = account.type === 'credit'
  const isNegative = account.balanceInPaise < 0

  const getAccountIcon = () => {
    switch (account.type) {
      case 'investment':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />
      case 'credit':
        return <CreditCard className="w-5 h-5 text-rose-500" />
      case 'savings':
        return <Building2 className="w-5 h-5 text-sky-500" />
      case 'checking':
      default:
        return <Wallet className="w-5 h-5 text-finflow-500" />
    }
  }

  return (
    <Card hover className="p-6 flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700 shadow-xs">
              {getAccountIcon()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {account.name}
              </h4>
              <p className="text-xs text-slate-400">
                {account.institution} • {account.accountNumberMasked}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50">
              <ShieldCheck className="w-3 h-3 mr-0.5" />
              {account.status}
            </span>
          </div>
        </div>

        {/* Balance Display */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            {isCredit ? 'Outstanding Balance' : 'Available Balance'}
          </div>
          <div
            className={`text-2xl font-extrabold mt-1 tracking-tight ${
              isCredit && isNegative
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {formatCurrency(Math.abs(account.balanceInPaise), currency)}
          </div>

          {isCredit && account.creditLimitInPaise && (
            <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
              <span>Limit: {formatCurrency(account.creditLimitInPaise, currency, { decimals: 0 })}</span>
              <span>
                Available:{' '}
                {formatCurrency(
                  account.creditLimitInPaise - Math.abs(account.balanceInPaise),
                  currency,
                  { decimals: 0 }
                )}
              </span>
            </div>
          )}
        </div>

        {/* Recent Activity for this Account */}
        <div className="mt-5 space-y-2">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Recent Ledger Entries
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-1.5">
              {recentTransactions.slice(0, 3).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0"
                >
                  <div className="truncate pr-2">
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                      {tx.merchant}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatFriendlyDate(tx.date)}
                    </span>
                  </div>
                  <span
                    className={`font-semibold shrink-0 ${
                      tx.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(tx.amountInPaise, currency)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-2">No activity on this account yet</p>
          )}
        </div>
      </div>

      {/* Card Action */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <Button
          variant="secondary"
          size="sm"
          className="w-full text-xs"
          onClick={() => onTransfer(account)}
        >
          <span>Transfer to / from Account</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </Card>
  )
}
