import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../lib/AuthContext"
import { isSupabaseConfigured } from "../lib/supabaseClient"

export default function Login() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-shell-900 via-shell-800 to-indigo-dark p-4">
      {/* Background grid pattern */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-float p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo/10 flex items-center justify-center mb-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#6366F1" fillOpacity="0.15" />
                <circle cx="16" cy="12" r="4" stroke="#6366F1" strokeWidth="2" fill="none" />
                <path d="M10 22 Q16 16 22 22" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M13 26 Q16 22 19 26" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <h1 className="font-display font-bold text-xl text-ink-900">Genolab LIMS</h1>
            <p className="text-sm text-ink-500 mt-1">Lab Analytics Dashboard</p>
          </div>

          {/* Demo mode hint */}
          {!isSupabaseConfigured && (
            <div className="mb-5 rounded-xl bg-indigo/5 border border-indigo/20 px-4 py-3">
              <p className="text-xs text-indigo-dark font-medium">Demo mode</p>
              <p className="text-xs text-ink-500 mt-0.5">
                Enter any email and password to sign in with mock data.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@genolab.in"
                required
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-rose/8 border border-rose/20 px-3 py-2.5">
                <p className="text-sm text-rose-dark">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo hover:bg-indigo-dark text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Signing in…
                </span>
              ) : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/30 mt-4">
          Genolab Bio-Sciences Pvt. Ltd. · Internal System
        </p>
      </div>
    </div>
  )
}
