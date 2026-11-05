import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { TransactionCategory, TransactionStatus, TransactionType } from '../../types'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full'

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  }

  const variantStyles = {
    default: 'bg-finflow-50 text-finflow-700 dark:bg-finflow-950/60 dark:text-finflow-300 border border-finflow-200/50 dark:border-finflow-800/40',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/40',
    info: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/40',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60',
  }

  return (
    <span
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      {...props}
    >
      {children}
    </span>
  )
}

export const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="success" size="sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Completed
        </Badge>
      )
    case 'pending':
      return (
        <Badge variant="warning" size="sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Pending
        </Badge>
      )
    case 'failed':
      return (
        <Badge variant="danger" size="sm">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Failed
        </Badge>
      )
  }
}

export const TypeBadge: React.FC<{ type: TransactionType }> = ({ type }) => {
  return type === 'income' ? (
    <Badge variant="success" size="sm">
      Income
    </Badge>
  ) : (
    <Badge variant="neutral" size="sm">
      Expense
    </Badge>
  )
}

export const CategoryBadge: React.FC<{ category: TransactionCategory }> = ({ category }) => {
  return (
    <Badge variant="neutral" size="sm">
      {category}
    </Badge>
  )
}
