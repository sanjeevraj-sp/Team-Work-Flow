import type { HTMLAttributes } from 'react'
import { cn } from '../../Utils/cn'

export type AlertVariant = 'success' | 'error' | 'info' | 'warn'

const variants: Record<AlertVariant, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-indigo-200 bg-indigo-50 text-indigo-800',
  warn: 'border-yellow-200 bg-yellow-50 text-yellow-800'
}

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  onDismiss?: () => void
}

export function Alert({ variant = 'info', onDismiss, className, children, ...props }: AlertProps) {
  return (
    <div className={cn('flex items-start gap-3 rounded-lg border px-4 py-3 text-sm', variants[variant], className)} {...props}>
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" className="opacity-60 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  )
}
