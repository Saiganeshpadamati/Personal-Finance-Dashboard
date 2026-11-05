import React, { useState } from 'react'
import {
  User,
  Moon,
  Sun,
  Coins,
  Bell,
  Download,
  RotateCcw,
  Info,
  CheckCircle,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  selectPreferences,
  setCurrency,
  setTheme,
  setDateFormat,
  updateNotificationSettings,
  updateProfile,
  resetPreferences,
} from '../features/preferences/preferencesSlice'
import { resetTransactions } from '../features/transactions/transactionsSlice'
import { resetBudgets } from '../features/budgets/budgetsSlice'
import { resetAccounts } from '../features/accounts/accountsSlice'
import { SupportedCurrency, DateFormatOption } from '../types'
import { exportStateToJSON } from '../utils/export'

export const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const preferences = useAppSelector(selectPreferences)
  const fullState = useAppSelector((state) => state)

  const [name, setName] = useState(preferences.profile.name)
  const [email, setEmail] = useState(preferences.profile.email)
  const [role, setRole] = useState(preferences.profile.role)
  const [savedAlert, setSavedAlert] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(updateProfile({ name, email, role }))
    setSavedAlert(true)
    setTimeout(() => setSavedAlert(false), 3000)
  }

  const handleExportBackup = () => {
    exportStateToJSON(fullState)
  }

  const handleConfirmReset = () => {
    localStorage.removeItem('finflow_transactions')
    localStorage.removeItem('finflow_budgets')
    localStorage.removeItem('finflow_accounts')
    localStorage.removeItem('finflow_preferences')

    dispatch(resetTransactions())
    dispatch(resetBudgets())
    dispatch(resetAccounts())
    dispatch(resetPreferences())

    setName('Yamin S.')
    setEmail('yamin@finflow.dev')
    setRole('Frontend Software Engineer')

    setIsResetModalOpen(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          System Preferences & Profile
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure financial display formats, security notifications, and local data persistence
        </p>
      </div>

      {savedAlert && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span>Profile preferences saved successfully!</span>
        </div>
      )}

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-finflow-600 dark:text-finflow-400" />
            <div>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Personalize your portfolio user information</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4 pb-2">
              <img
                src={preferences.profile.avatarUrl}
                alt={preferences.profile.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-finflow-500"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{name}</h4>
                <p className="text-xs text-slate-400">{role}</p>
                <p className="text-[11px] text-finflow-600 dark:text-finflow-400 mt-0.5">
                  Revolut Frontend Internship Portfolio Candidate
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Regional & Display Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-finflow-600 dark:text-finflow-400" />
            <div>
              <CardTitle>Regional & Currency Preferences</CardTitle>
              <CardDescription>Configure currency denomination and date formats</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Currency selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Display Currency
              </label>
              <select
                value={preferences.currency}
                onChange={(e) => dispatch(setCurrency(e.target.value as SupportedCurrency))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
              >
                <option value="INR">INR (₹) – Indian Rupee (Default)</option>
                <option value="USD">USD ($) – US Dollar</option>
                <option value="EUR">EUR (€) – Euro</option>
                <option value="GBP">GBP (£) – British Pound</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Amounts are stored internally in base INR paise and rendered using standard locales.
              </p>
            </div>

            {/* Date format */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date Formatting
              </label>
              <select
                value={preferences.dateFormat}
                onChange={(e) => dispatch(setDateFormat(e.target.value as DateFormatOption))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-finflow-500 focus:outline-none dark:text-white"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 05/11/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 11/05/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-11-05)</option>
              </select>
            </div>
          </div>

          {/* Theme selector */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Appearance Theme
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => dispatch(setTheme('light'))}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all ${
                  preferences.theme === 'light'
                    ? 'border-finflow-500 bg-finflow-50/50 text-finflow-700 dark:text-white ring-2 ring-finflow-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Theme</span>
              </button>

              <button
                type="button"
                onClick={() => dispatch(setTheme('dark'))}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all ${
                  preferences.theme === 'dark'
                    ? 'border-finflow-500 bg-slate-800 text-white ring-2 ring-finflow-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-4 h-4 text-finflow-400" />
                <span>Dark Theme</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-finflow-600 dark:text-finflow-400" />
            <div>
              <CardTitle>Financial Alert Notifications</CardTitle>
              <CardDescription>Toggle alerts for budget warnings and high transactions</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Budget Threshold Alerts
              </span>
              <p className="text-[11px] text-slate-400">
                Notify when monthly spending exceeds 80% of category bounds
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications.budgetAlerts}
              onChange={(e) =>
                dispatch(updateNotificationSettings({ budgetAlerts: e.target.checked }))
              }
              className="w-4 h-4 text-finflow-600 rounded focus:ring-finflow-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Large Transaction Alert
              </span>
              <p className="text-[11px] text-slate-400">
                Alert on purchases exceeding ₹10,000.00
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications.largeTransactionAlerts}
              onChange={(e) =>
                dispatch(
                  updateNotificationSettings({ largeTransactionAlerts: e.target.checked })
                )
              }
              className="w-4 h-4 text-finflow-600 rounded focus:ring-finflow-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Weekly Wealth Summary
              </span>
              <p className="text-[11px] text-slate-400">
                Weekly digest summarizing savings and top expenditure changes
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications.weeklyDigest}
              onChange={(e) =>
                dispatch(updateNotificationSettings({ weeklyDigest: e.target.checked }))
              }
              className="w-4 h-4 text-finflow-600 rounded focus:ring-finflow-500"
            />
          </label>
        </CardContent>
      </Card>

      {/* Data Management & System Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-finflow-600 dark:text-finflow-400" />
            <div>
              <CardTitle>Data Management & Sandbox Reset</CardTitle>
              <CardDescription>Export ledger backups or reset demo simulation to initial state</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800">
            <div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-white">
                Export Complete Data Backup
              </h5>
              <p className="text-[11px] text-slate-400">
                Download transactions, budgets, and accounts as a portable JSON file.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleExportBackup}
            >
              Export JSON
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/40">
            <div>
              <h5 className="text-xs font-bold text-rose-800 dark:text-rose-200">
                Reset Demo Sandbox
              </h5>
              <p className="text-[11px] text-rose-600/80 dark:text-rose-300/80">
                Clear all custom entries and restore initial 35+ transactions and 4 accounts.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => setIsResetModalOpen(true)}
            >
              Reset Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset All Sandbox Data?"
        description="This will restore the original demo transactions, accounts, and budgets."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Any custom transactions or adjusted budgets will be replaced with the standard
            portfolio dataset.
          </p>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmReset}>
              Yes, Reset Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SettingsPage
