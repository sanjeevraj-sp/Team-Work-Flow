import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { Alert, type AlertVariant } from '../Components/ui/alert';

type ShowToast = (message: string, variant?: AlertVariant) => void

interface ToastItem {
  id: number
  message: string
  variant: AlertVariant
}

const ToastContext = createContext<ShowToast | null>(null)
let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback<ShowToast>(
    (message, variant = 'success') => {
      const id = nextId++
      setToasts((current) => [...current, { id, message, variant }])
      setTimeout(() => dismiss(id), 4000)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={show}>
      {children}
     
      <div aria-live="polite" className="fixed right-4 bottom-4 z-50 flex w-80 flex-col gap-2">
        {toasts.map((toast) => (
          <Alert key={toast.id} variant={toast.variant} onDismiss={() => dismiss(toast.id)} className="shadow-lg">
            {toast.message}
          </Alert>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const show = useContext(ToastContext)
  if (!show) throw new Error('useToast must be used inside <ToastProvider>')
  return show
}
