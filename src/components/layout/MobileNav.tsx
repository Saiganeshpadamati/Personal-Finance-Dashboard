import React from 'react'
import { Sidebar } from './Sidebar'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-64 z-50 bg-white dark:bg-navy-900 shadow-2xl animate-in slide-in-from-left duration-200">
        <Sidebar onNavigate={onClose} />
      </div>
    </div>
  )
}
