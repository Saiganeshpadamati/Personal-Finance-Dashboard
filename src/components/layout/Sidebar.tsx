import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Wallet,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import { clsx } from 'clsx'
import { useAppSelector } from '../../app/hooks'
import { selectNetWorthSummary } from '../../features/accounts/accountsSlice'
import { selectCurrency } from '../../features/preferences/preferencesSlice'
import { formatCompactCurrency } from '../../utils/currency'

interface SidebarProps {
  onNavigate?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const netWorthSummary = useAppSelector(selectNetWorthSummary)
  const currency = useAppSelector(selectCurrency)

  const navLinks = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Transactions', path: '/transactions', icon: Receipt },
    { label: 'Analytics', path: '/analytics', icon: PieChart },
    { label: 'Budgets', path: '/budgets', icon: Target },
    { label: 'Accounts', path: '/accounts', icon: Wallet },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <aside className="w-64 h-screen bg-white dark:bg-navy-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-finflow-700 to-finflow-500 flex items-center justify-center text-white shadow-md shadow-finflow-500/20">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                FinFlow
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-finflow-50 text-finflow-700 dark:bg-finflow-950/80 dark:text-finflow-400">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium -mt-0.5">
              Personal Wealth
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-5">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Navigation
          </div>
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                      isActive
                        ? 'bg-finflow-50 text-finflow-700 font-semibold dark:bg-finflow-950/80 dark:text-finflow-300 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={clsx(
                          'w-4 h-4 transition-colors',
                          isActive
                            ? 'text-finflow-600 dark:text-finflow-400'
                            : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        )}
                      />
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-finflow-600 dark:bg-finflow-400" />
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer Widget: Net Worth mini overview */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Total Net Worth</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
            {formatCompactCurrency(netWorthSummary.totalNetWorthPaise, currency)}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            4 Simulated Accounts
          </div>
        </div>

        <div className="mt-3 px-1 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            FinFlow v1.0.0 • Portfolio Edition
          </p>
        </div>
      </div>
    </aside>
  )
}
