import React from 'react'
import {
  Wallet,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Info,
} from 'lucide-react'
import { StatCard } from '../components/common/StatCard'
import { QuickActions } from '../components/dashboard/QuickActions'
import { CashFlowChart } from '../components/dashboard/CashFlowChart'
import { CategoryPieChart } from '../components/dashboard/CategoryPieChart'
import { RecentTransactions } from '../components/dashboard/RecentTransactions'
import { BudgetProgressWidget } from '../components/dashboard/BudgetProgressWidget'
import { useAppSelector } from '../app/hooks'
import { selectMonthlyFinancialTotals } from '../features/transactions/transactionsSlice'
import { selectNetWorthSummary } from '../features/accounts/accountsSlice'

export const Dashboard: React.FC = () => {
  const totals = useAppSelector(selectMonthlyFinancialTotals)
  const netWorthSummary = useAppSelector(selectNetWorthSummary)

  return (
    <div className="space-y-6">
      {/* Simulation Info Banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-finflow-500/10 via-finflow-500/5 to-transparent border border-finflow-500/20 text-xs text-finflow-800 dark:text-finflow-200">
        <Info className="w-4 h-4 text-finflow-600 dark:text-finflow-400 shrink-0" />
        <p className="flex-1">
          <strong className="font-semibold">Simulated Fintech Sandbox:</strong> Managing fictional
          INR financial assets with high-precision paise ledger calculations and localStorage
          persistence.
        </p>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Net Balance"
          amountInPaise={netWorthSummary.totalNetWorthPaise}
          changePercent={totals.savingsMoMChangePercent}
          timeframeLabel="vs last month"
          icon={<Wallet className="w-5 h-5" />}
          iconBgColor="bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400"
        />

        <StatCard
          title={`Income (${totals.currentMonthLabel.split(' ')[0]})`}
          amountInPaise={totals.currentMonthIncomePaise}
          changePercent={totals.incomeMoMChangePercent}
          timeframeLabel="vs last month"
          icon={<TrendingUp className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400"
        />

        <StatCard
          title={`Expenses (${totals.currentMonthLabel.split(' ')[0]})`}
          amountInPaise={totals.currentMonthExpensePaise}
          changePercent={totals.expenseMoMChangePercent}
          timeframeLabel="vs last month"
          isInverseTrend={true}
          icon={<CreditCard className="w-5 h-5" />}
          iconBgColor="bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400"
        />

        <StatCard
          title="Net Monthly Savings"
          amountInPaise={totals.currentMonthSavingsPaise}
          changePercent={totals.savingsRateDiffPercent}
          timeframeLabel={`${totals.currentMonthSavingsRate.toFixed(0)}% savings rate`}
          icon={<PiggyBank className="w-5 h-5" />}
          iconBgColor="bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400"
        />
      </div>

      {/* Quick Action CTAs */}
      <QuickActions />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <CashFlowChart />
        </div>
        <div className="lg:col-span-5">
          <CategoryPieChart />
        </div>
      </div>

      {/* Tables & Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RecentTransactions />
        </div>
        <div className="lg:col-span-5">
          <BudgetProgressWidget />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
