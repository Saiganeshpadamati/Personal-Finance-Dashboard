import React, { useState, useRef, useEffect } from 'react'
import { Bell, CheckCheck, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react'

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  type: 'warning' | 'info' | 'success'
  isRead: boolean
}

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Budget Alert: Food & Dining',
      message: 'Monthly food spending has reached 82% of your ₹25,000 budget.',
      time: '10m ago',
      type: 'warning',
      isRead: false,
    },
    {
      id: '2',
      title: 'Salary Deposit Processed',
      message: '₹1,45,000.00 credited to HDFC Salary Account from Revolut India.',
      time: '2h ago',
      type: 'success',
      isRead: false,
    },
    {
      id: '3',
      title: 'High Value Expense',
      message: 'Amazon India purchase of ₹8,499.00 recorded on Axis Neo Credit Card.',
      time: '1d ago',
      type: 'info',
      isRead: true,
    },
    {
      id: '4',
      title: 'Simulated Sandbox Notice',
      message: 'FinFlow is running in demo mode. All data is stored locally in your browser.',
      time: '2d ago',
      type: 'info',
      isRead: true,
    },
  ])

  const dropdownRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-finflow-600 ring-2 ring-white dark:ring-navy-900 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-navy-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-finflow-100 text-finflow-700 dark:bg-finflow-950 dark:text-finflow-300">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs text-finflow-600 dark:text-finflow-400 hover:underline flex items-center gap-1 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex gap-3 ${
                  !item.isRead ? 'bg-finflow-50/40 dark:bg-finflow-950/20' : ''
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {item.type === 'warning' && (
                    <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                  {item.type === 'success' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                  {item.type === 'info' && (
                    <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 pt-2 text-center border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">All alerts auto-synchronized</span>
          </div>
        </div>
      )}
    </div>
  )
}
