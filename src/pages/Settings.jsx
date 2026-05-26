import AppShell from "../components/AppShell"
import { useAuth } from "../lib/AuthContext"
import { isSupabaseConfigured } from "../lib/supabaseClient"

export default function Settings({ darkMode, setDarkMode }) {
  const { user } = useAuth()

  return (
    <AppShell>
      <div className="mb-7">
        <h1 className="font-display text-2xl font-bold text-ink-900">Settings</h1>
        <p className="text-sm text-ink-500 mt-1">Manage your preferences and account.</p>
      </div>

      <div className="max-w-xl space-y-5">
        {/* Profile card */}
        <Section title="Profile">
          <Row label="Name"  value="Lab Admin" />
          <Row label="Role"  value="Administrator" />
          <Row label="Email" value={user?.email ?? "admin@genolab.in"} mono />
          <Row label="Organisation" value="Genolab Bio-Sciences Pvt. Ltd." />
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-ink-900">Dark mode</p>
              <p className="text-xs text-ink-500 mt-0.5">Optimised for low-light lab environments.</p>
            </div>
            <button
              onClick={() => setDarkMode((d) => !d)}
              className={`relative w-11 h-6 rounded-full transition-colors ${darkMode ? "bg-indigo" : "bg-canvas-200"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </Section>

        {/* System info */}
        <Section title="System">
          <Row label="Database" value={isSupabaseConfigured ? "Supabase (live)" : "Mock data (demo)"} />
          <Row label="Version"  value="1.0.0" mono />
          <Row label="Stack"    value="Vite + React + Tailwind + Supabase" />
        </Section>
      </div>
    </AppShell>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-canvas-100">
        <h2 className="font-display text-sm font-semibold text-ink-900">{title}</h2>
      </div>
      <div className="px-6 py-4 divide-y divide-canvas-100">{children}</div>
    </div>
  )
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-ink-500">{label}</span>
      <span className={`text-sm font-medium text-ink-900 ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  )
}
