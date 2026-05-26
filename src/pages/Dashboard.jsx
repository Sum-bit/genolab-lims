import { useEffect, useMemo, useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"
import AppShell from "../components/AppShell"
import StatusBadge from "../components/StatusBadge"
import { fetchSamples } from "../lib/supabaseClient"
import { getIntakeTrend } from "../data/mockSamples"

const PIE_COLORS = ["#6366F1", "#F59E0B", "#10B981", "#F43F5E"]
const TEST_TYPE_COLORS = ["#6366F1","#10B981","#F59E0B","#F43F5E","#0EA5E9"]

function today() { return new Date().toISOString().split("T")[0] }

function daysBetween(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  return Math.floor((now - d) / (1000 * 60 * 60 * 24))
}

export default function Dashboard() {
  const [samples, setSamples] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    fetchSamples()
      .then((data) => { setSamples(data); setLoading(false) })
      .catch((e) => { setError(e.message); setLoading(false) })
  }, [])

  const stats = useMemo(() => {
    const todayStr = today()
    const todaySamples   = samples.filter((s) => s.date_received === todayStr)
    const pending        = samples.filter((s) => s.status === "Received" || s.status === "In Testing")
    const completedToday = samples.filter((s) => s.status === "Completed" && s.date_received === todayStr)
    const flagged        = samples.filter((s) => s.status === "Flagged")
    const overdue        = samples.filter(
      (s) => (s.status === "Received" || s.status === "In Testing") && daysBetween(s.date_received) >= 2
    )

    // Pie: status breakdown
    const statusCounts = { Received: 0, "In Testing": 0, Completed: 0, Flagged: 0 }
    for (const s of samples) statusCounts[s.status] = (statusCounts[s.status] || 0) + 1
    const statusPie = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

    // Test type distribution
    const typeCounts = {}
    for (const s of samples) typeCounts[s.test_type] = (typeCounts[s.test_type] || 0) + 1
    const typePie = Object.entries(typeCounts).map(([name, value]) => ({ name, value }))

    return { todaySamples, pending, completedToday, flagged, overdue, statusPie, typePie }
  }, [samples])

  // Line chart: last 7 days intake
  const intakeTrend = useMemo(() => getIntakeTrend(), [])

  // Recent 8 samples
  const recentSamples = useMemo(() => samples.slice(0, 8), [samples])

  if (error) return (
    <AppShell>
      <div className="rounded-xl bg-rose/8 border border-rose/20 p-4 text-rose-dark text-sm">
        Failed to load data: {error}
      </div>
    </AppShell>
  )

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-display text-2xl font-bold text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-500 mt-1">Live overview of lab operations at Genolab.</p>
      </div>

      {/* Overdue alert */}
      {!loading && stats.overdue.length > 0 && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose/25 bg-rose/5 px-4 py-3.5 animate-fade-in">
          <span className="mt-0.5 w-2 h-2 rounded-full bg-rose shrink-0 animate-pulse" />
          <div>
            <p className="text-sm font-semibold text-rose-dark">
              {stats.overdue.length} sample{stats.overdue.length !== 1 ? "s" : ""} overdue
            </p>
            <p className="text-xs text-rose-dark/70 mt-0.5">
              Pending for 48+ hours — check Sample Tracker to update their status.
            </p>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        <StatCard label="Samples Today"    value={loading ? "—" : stats.todaySamples.length}   accent="indigo"  icon={<IconVial />}   />
        <StatCard label="Pending Tests"    value={loading ? "—" : stats.pending.length}         accent="amber"   icon={<IconClock />}  />
        <StatCard label="Completed Today"  value={loading ? "—" : stats.completedToday.length}  accent="emerald" icon={<IconCheck />}  />
        <StatCard label="Flagged Samples"  value={loading ? "—" : stats.flagged.length}         accent="rose"    icon={<IconFlag />}   />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
        {/* Line chart */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-display text-sm font-semibold text-ink-900 mb-5">Sample Intake — Last 7 Days</h2>
          {loading ? <Skeleton h={220} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={intakeTrend}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 16px rgba(15,23,42,0.1)", fontSize: 12 }}
                  labelStyle={{ color: "#334155", fontWeight: 600 }}
                />
                <Line
                  type="monotone" dataKey="count" stroke="#6366F1"
                  strokeWidth={2.5} dot={{ r: 4, fill: "#6366F1", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#6366F1", strokeWidth: 2, stroke: "white" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status pie */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-display text-sm font-semibold text-ink-900 mb-5">Status Breakdown</h2>
          {loading ? <Skeleton h={220} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.statusPie} dataKey="value" nameKey="name"
                  cx="50%" cy="45%" innerRadius={50} outerRadius={80} paddingAngle={2}
                >
                  {stats.statusPie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent samples table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-canvas-100 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold text-ink-900">Recent Samples</h2>
          <span className="text-xs text-ink-500">{samples.length} total</span>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} h={36} />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-canvas-50 text-left">
                  <Th>Sample ID</Th>
                  <Th>Patient</Th>
                  <Th>Test Type</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-100">
                {recentSamples.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-ink-500 text-sm">No samples yet — add one in Sample Tracker.</td></tr>
                ) : recentSamples.map((s) => (
                  <tr key={s.id} className="hover:bg-canvas-50 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-indigo-dark text-xs font-medium">{s.sample_id}</td>
                    <td className="px-6 py-3.5 text-ink-900">{s.patient_name}</td>
                    <td className="px-6 py-3.5 text-ink-700">{s.test_type}</td>
                    <td className="px-6 py-3.5 text-ink-500 font-mono text-xs">{s.date_received}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  )
}

function StatCard({ label, value, accent, icon }) {
  const accentMap = {
    indigo:  { text: "text-indigo",       bg: "bg-indigo/8",  border: "border-l-indigo"  },
    amber:   { text: "text-amber-dark",   bg: "bg-amber/8",   border: "border-l-amber"   },
    emerald: { text: "text-emerald-dark", bg: "bg-emerald/8", border: "border-l-emerald" },
    rose:    { text: "text-rose-dark",    bg: "bg-rose/8",    border: "border-l-rose"    },
  }
  const a = accentMap[accent]
  return (
    <div className={`bg-white rounded-2xl shadow-card p-5 border-l-4 ${a.border}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-ink-500">{label}</p>
        <div className={`w-8 h-8 rounded-lg ${a.bg} flex items-center justify-center ${a.text}`}>
          {icon}
        </div>
      </div>
      <p className={`font-display text-3xl font-bold ${a.text}`}>{value}</p>
    </div>
  )
}

function Th({ children }) {
  return <th className="px-6 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">{children}</th>
}

function Skeleton({ h }) {
  return <div className={`rounded-lg bg-canvas-100 animate-pulse w-full`} style={{ height: h }} />
}

function IconVial() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M9 3h6M9 3v8l-4 8a1 1 0 00.9 1.5h12.2A1 1 0 0019 19l-4-8V3" /></svg> }
function IconClock() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg> }
function IconCheck() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20 6L9 17l-5-5"/></svg> }
function IconFlag()  { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> }
