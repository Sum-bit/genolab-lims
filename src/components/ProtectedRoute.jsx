import { Navigate } from "react-router-dom"
import { useAuth } from "../lib/AuthContext"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo border-t-transparent animate-spin" />
          <p className="text-sm text-ink-500">Loading…</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}
