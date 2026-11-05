import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-card transition-all duration-200',
          hover && 'hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={twMerge(
      clsx('px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between', className)
    )}
    {...props}
  >
    {children}
  </div>
)

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3
    className={twMerge(
      clsx('text-base font-semibold text-slate-900 dark:text-slate-100', className)
    )}
    {...props}
  >
    {children}
  </h3>
)

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p
    className={twMerge(
      clsx('text-xs text-slate-500 dark:text-slate-400 mt-0.5', className)
    )}
    {...props}
  >
    {children}
  </p>
)

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={twMerge(clsx('p-6', className))} {...props}>
    {children}
  </div>
)

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={twMerge(
      clsx('px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between', className)
    )}
    {...props}
  >
    {children}
  </div>
)
