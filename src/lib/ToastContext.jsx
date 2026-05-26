import { createContext, useCallback, useContext, useState } from "react"

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            className={`animate-slide-up flex items-center gap-3 px-4 py-3 rounded-xl shadow-float text-sm font-medium cursor-pointer select-none
              ${t.type === "success" ? "bg-emerald text-white" : ""}
              ${t.type === "error"   ? "bg-rose text-white"    : ""}
              ${t.type === "info"    ? "bg-indigo text-white"  : ""}
              ${t.type === "warning" ? "bg-amber text-white"   : ""}
            `}
          >
            <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
