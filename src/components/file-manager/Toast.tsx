import React, { createContext, useContext, useMemo, useRef, useState } from 'react'

type ToastKind = 'success' | 'error' | 'info'

type ToastItem = {
  id: number
  message: string
  kind: ToastKind
}

type ToastOptions = {
  kind?: ToastKind
  durationMs?: number
}

type ToastApi = {
  show: (message: string, opts?: ToastOptions) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function ToastHost({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const seq = useRef(1)

  const api = useMemo<ToastApi>(() => ({
    show: (message, opts) => {
      const id = seq.current++
      const kind: ToastKind = opts?.kind ?? 'info'
      const durationMs = opts?.durationMs ?? 2600
      setToasts(prev => [...prev, { id, message, kind }])
      window.setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, durationMs)
    },
  }), [])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed right-4 top-4 z-[60] flex flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={[
              'min-w-[220px] max-w-[360px] rounded-xl border px-4 py-3 shadow-lg backdrop-blur',
              'bg-white/90 text-gray-900 border-gray-200',
              t.kind === 'success' ? 'border-emerald-200' : '',
              t.kind === 'error' ? 'border-red-200' : '',
            ].join(' ')}
            role="status"
            aria-live="polite"
          >
            <div className="text-sm font-medium">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // failsafe (should not happen if ToastHost wraps the tree)
    return { show: () => void 0 }
  }
  return ctx
}
