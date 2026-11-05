import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Search,
  Sun,
  Moon,
  Plus,
  Menu,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  selectTheme,
  toggleTheme,
  selectProfile,
} from '../../features/preferences/preferencesSlice'
import { Button } from '../common/Button'
import { NotificationDropdown } from './NotificationDropdown'
import { SearchModal } from './SearchModal'
import { TransactionModal } from '../transactions/TransactionModal'

interface HeaderProps {
  onToggleMobileNav: () => void
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Financial Overview', subtitle: 'Real-time dashboard and cash flow monitoring' },
  '/transactions': {
    title: 'Transaction History',
    subtitle: 'Manage and categorize your income and expenditures',
  },
  '/analytics': {
    title: 'Financial Analytics',
    subtitle: 'Deep insights into spending trends and wealth accumulation',
  },
  '/budgets': {
    title: 'Budget Management',
    subtitle: 'Monthly category limits and spending velocity tracking',
  },
  '/accounts': {
    title: 'Accounts & Portfolios',
    subtitle: 'Simulated multi-institution accounts and balances',
  },
  '/settings': {
    title: 'Preferences & System',
    subtitle: 'Customize currency, theme, notifications, and profile',
  },
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useAppSelector(selectTheme)
  const profile = useAppSelector(selectProfile)

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAddTxOpen, setIsAddTxOpen] = useState(false)

  const currentPath = location.pathname
  const pageInfo = PAGE_TITLES[currentPath] || {
    title: 'Dashboard',
    subtitle: 'FinFlow Personal Wealth Manager',
  }

  // Keyboard shortcut for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header className="h-16 px-4 sm:px-8 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-30 flex items-center justify-between">
        {/* Left: Mobile Nav Button & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileNav}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              {pageInfo.title}
            </h1>
            <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
              {pageInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Search, Quick Add, Theme, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs border border-slate-200/50 dark:border-slate-700/50 transition-colors w-48 justify-between"
          >
            <div className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              <span>Search ledger...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* Quick Add Transaction Button */}
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddTxOpen(true)}
            className="hidden sm:inline-flex"
          >
            Transaction
          </Button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* User Profile Avatar */}
          <div
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800 cursor-pointer group"
          >
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-finflow-500/20 group-hover:ring-finflow-500 transition-all"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {profile.name}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">{profile.role}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Global Quick Add Transaction Modal */}
      <TransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        mode="create"
      />
    </>
  )
}
