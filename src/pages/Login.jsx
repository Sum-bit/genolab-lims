import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../lib/AuthContext"
import { useAppContext } from "../App"
import { isSupabaseConfigured } from "../lib/supabaseClient"

export default function Login() {
  const { loginDemo, loginLive } = useAuth()
  const { mode, setMode }        = useAppContext()
  const navigate                 = useNavigate()
  const [email, setEmail]        = useState("")
  const [password, setPassword]  = useState("")
  const [error, setError]        = useState("")
  const [loading, setLoading]    = useState(false)

  async function handleDemo() {
    setError("")
    setLoading(true)
    try {
      await loginDemo()
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLiveSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await loginLive(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const isDemo = mode === "demo"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-shell-900 via-shell-800 to-indigo-dark p-4">
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-sm animate-slide-up">
        <div className="bg-white rounded-2xl shadow-float p-8">

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
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

          {/* Mode Toggle */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center bg-canvas-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => { setMode("demo"); setError("") }}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isDemo
                    ? "bg-indigo text-white shadow-sm"
                    : "text-ink-500 hover:text-ink-700"
                }`}
              >
                Demo
              </button>
              <button
                onClick={() => { setMode("live"); setError("") }}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  !isDemo
                    ? "bg-indigo text-white shadow-sm"
                    : "text-ink-500 hover:text-ink-700"
                }`}
              >
                Live
              </button>
            </div>
          </div>

          {/* Demo Mode */}
          {isDemo ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-indigo/5 border border-indigo/20 px-4 py-4 text-center">
                <p className="text-sm font-semibold text-indigo-dark mb-1">Demo Mode</p>
                <p className="text-xs text-ink-500">
                  Explore the full dashboard with pre-loaded sample data. No credentials needed.
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-rose/8 border border-rose/20 px-3 py-2.5">
                  <p className="text-sm text-rose-dark">{error}</p>
                </div>
              )}

              <button
                onClick={handleDemo}
                disabled={loading}
                className="w-full bg-indigo hover:bg-indigo-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Loading…
                  </span>
                ) : "Try Demo →"}
              </button>
            </div>
          ) : (
            /* Live Mode */
            <div className="space-y-4">
              {!isSupabaseConfigured && (
                <div className="rounded-xl bg-amber/8 border border-amber/20 px-4 py-3">
                  <p className="text-xs font-medium text-amber-dark">Supabase not configured</p>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable live mode.
                  </p>
                </div>
              )}

              <form onSubmit={handleLiveSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Email address</label>
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
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
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
                  disabled={loading || !isSupabaseConfigured}
                  className="w-full bg-indigo hover:bg-indigo-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Signing in…
                    </span>
                  ) : "Sign In →"}
                </button>
              </form>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-white/30 mt-4">
          Genolab Bio-Sciences Pvt. Ltd. · Internal System
        </p>
      </div>
    </div>
  )
}
