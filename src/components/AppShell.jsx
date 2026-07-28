import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../lib/AuthContext"
import { isLiveMode } from "../lib/supabaseClient"

const NAV = [
  { to: "/dashboard",  label: "Dashboard",      icon: IconDashboard  },
  { to: "/tracker",    label: "Sample Tracker",  icon: IconFlask      },
  { to: "/analytics",  label: "Analytics",       icon: IconChart      },
  { to: "/settings",   label: "Settings",        icon: IconSettings   },
]

export default function AppShell({ children }) {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex bg-canvas-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-shell-900/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 shrink-0
        bg-shell-900 text-white flex flex-col grid-pattern
        transform transition-transform duration-200 ease-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <GenolabMark />
            <div>
              <p className="font-display font-semibold text-white tracking-tight leading-none">Genolab</p>
              <p className="text-[10px] text-indigo-light tracking-widest uppercase mt-0.5 font-mono">LIMS Analytics</p>
            </div>
          </div>
        </div>

        {/* Live pulse indicator */}
        <div className="px-5 py-3 border-b border-white/8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse-dot" />
            <span className="text-[11px] text-ink-300 font-mono">Lab system active</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] text-white/30 tracking-widest uppercase font-mono">Navigation</p>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? "nav-active text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/8">
          {!isLiveMode() && (
            <div className="mb-3 rounded-lg bg-amber/10 border border-amber/20 px-3 py-2">
              <p className="text-[11px] text-amber leading-snug">
                Demo mode — mock data active.
              </p>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] text-white/40">Signed in as</p>
              <p className="text-sm font-medium text-white truncate">{user?.email ?? "Lab Admin"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="shrink-0 text-xs px-2.5 py-1.5 rounded-md border border-white/15 text-white/60 hover:text-white hover:bg-white/8 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="md:hidden sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-white border-b border-canvas-200 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md text-ink-500 hover:bg-canvas-100"
          >
            <IconMenu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <GenolabMark size={24} />
            <span className="font-display font-semibold text-ink-900">Genolab LIMS</span>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

// ─── Genolab logomark ─────────────────────────────────────────────────────────
function GenolabMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#6366F1" fillOpacity="0.15" />
      <circle cx="16" cy="12" r="4" stroke="#6366F1" strokeWidth="2" fill="none" />
      <path d="M10 22 Q16 16 22 22" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M13 26 Q16 22 19 26" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconDashboard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}
function IconFlask(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 3h6M9 3v8l-4 8a1 1 0 00.9 1.5h12.2A1 1 0 0019 19l-4-8V3" />
    </svg>
  )
}
function IconChart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18" />
      <path d="M18 9l-5 5-2-3-5 5" />
    </svg>
  )
}
function IconSettings(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}
function IconMenu(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}