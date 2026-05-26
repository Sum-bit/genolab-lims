import { useEffect, useMemo, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts"
import AppShell from "../components/AppShell"
import { fetchSamples } from "../lib/supabaseClient"
import { TEST_TYPES } from "../data/mockSamples"

const STATUS_COLORS = { Received: "#6366F1", "In Testing": "#F59E0B", Completed: "#10B981", Flagged: "#F43F5E" }
const TYPE_COLORS   = ["#6366F1","#10B981","#F59E0B","#F43F5E","#0EA5E9"]

function weekOf(dateStr) {
  const d   = new Date(dateStr)
  const day = d.getDay()
  const mon = new Date(d)
  mon.setDate(d.getDate() - ((day + 6) % 7))
  return mon.toISOString().split("T")[0]
}

export default function Analytics() {
  const [samples, setSamples] = useState([])
  const [loading, setLoading] = useState(true)
  const [from, setFrom]       = useState("")
  const [to, setTo]           = useState("")

  useEffect(() => {
    fetchSamples().then((d) => { setSamples(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return samples.filter((s) => {
      if (from && s.date_received < from) return false
      if (to   && s.date_received > to)   return false
      return true
    })
  }, [samples, from, to])

  // Weekly intake (last 4 weeks)
  const weeklyData = useMemo(() => {
    const weeks = {}
    for (let i = 3; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i * 7)
      const key = weekOf(d.toISOString().split("T")[0])
      weeks[key] = 0
    }
    for (const s of filtered) {
      const w = weekOf(s.date_received)
      if (weeks[w] !== undefined) weeks[w]++
    }
    return Object.entries(weeks).map(([week, count]) => ({ week: week.slice(5), count }))
  }, [filtered])

  // Status breakdown
  const statusData = useMemo(() => {
    const counts = { Received: 0, "In Testing": 0, Completed: 0, Flagged: 0 }
    for (const s of filtered) counts[s.status] = (counts[s.status] || 0) + 1
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [filtered])

  // Avg days to completion by test type
  const avgCompletionData = useMemo(() => {
    const byType = {}
    for (const s of filtered) {
      if (s.status === "Completed") {
        const days = Math.floor((new Date() - new Date(s.date_received)) / (1000*60*60*24))
        if (!byType[s.test_type]) byType[s.test_type] = { total: 0, count: 0 }
        byType[s.test_type].total += days
        byType[s.test_type].count++
      }
    }
    return TEST_TYPES.map((t) => ({
      type: t.split(" ")[0], // short label
      avgDays: byType[t] ? +(byType[t].total / byType[t].count).toFixed(1) : 0,
    }))
  }, [filtered])

  // Summary stats
  const summary = useMemo(() => {
    const completed = filtered.filter((s) => s.status === "Completed")
    const avgTime = completed.length
      ? (completed.reduce((acc, s) => acc + Math.floor((new Date() - new Date(s.date_received)) / (1000*60*60*24)), 0) / completed.length).toFixed(1)
      : "—"
    const flaggedRate = filtered.length ? ((filtered.filter(s => s.status === "Flagged").length / filtered.length) * 100).toFixed(1) : "0"
    return { total: filtered.length, avgTime, flaggedRate }
  }, [filtered])

  function exportCSV() {
    const rows = [
      ["Sample ID","Patient Name","Test Type","Date Received","Status","Result"],
      ...filtered.map((s) => [s.sample_id, s.patient_name, s.test_type, s.date_received, s.status, s.result ?? "—"])
    ]
    const csv  = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a"); a.href = url; a.download = "genolab_samples.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AppShell>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Analytics</h1>
          <p className="text-sm text-ink-500 mt-1">Lab performance metrics and trends.</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 border border-canvas-200 text-ink-700 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-canvas-100 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>

      {/* Date filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm text-ink-500">From</label>
          <input type="date" className="input w-auto text-sm" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-ink-500">To</label>
          <input type="date" className="input w-auto text-sm" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        {(from || to) && (
          <button onClick={() => { setFrom(""); setTo("") }} className="text-sm text-indigo hover:underline">Clear</button>
        )}
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <SummaryCard label="Total Samples" value={loading ? "—" : summary.total} sub="in selected range" />
        <SummaryCard label="Avg Completion Time" value={loading ? "—" : `${summary.avgTime}d`} sub="for completed tests" />
        <SummaryCard label="Flagged Rate" value={loading ? "—" : `${summary.flaggedRate}%`} sub="of all samples" accent={parseFloat(summary.flaggedRate) > 10} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Weekly intake bar */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-display text-sm font-semibold text-ink-900 mb-5">Weekly Intake (Last 4 Weeks)</h2>
          {loading ? <div className="h-48 bg-canvas-100 rounded-xl animate-pulse" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barSize={32}>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", fontSize: 12 }} />
                <Bar dataKey="count" fill="#6366F1" radius={[6,6,0,0]} name="Samples" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status donut */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-display text-sm font-semibold text-ink-900 mb-5">Status Distribution</h2>
          {loading ? <div className="h-48 bg-canvas-100 rounded-xl animate-pulse" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {statusData.map((entry) => <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Avg completion by test type */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-display text-sm font-semibold text-ink-900 mb-5">Avg Days to Completion by Test Type</h2>
        {loading ? <div className="h-48 bg-canvas-100 rounded-xl animate-pulse" /> : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={avgCompletionData} barSize={40}>
              <CartesianGrid vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="type" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} allowDecimals={false} unit="d" />
              <Tooltip contentStyle={{ borderRadius: 10, border: "none", fontSize: 12 }} formatter={(v) => [`${v} days`]} />
              <Bar dataKey="avgDays" radius={[6,6,0,0]} name="Avg Days">
                {avgCompletionData.map((_, i) => <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </AppShell>
  )
}

function SummaryCard({ label, value, sub, accent }) {
  return (
    <div className={`bg-white rounded-2xl shadow-card p-5 ${accent ? "border border-rose/30" : ""}`}>
      <p className="text-xs font-medium text-ink-500 mb-2">{label}</p>
      <p className={`font-display text-3xl font-bold ${accent ? "text-rose" : "text-ink-900"}`}>{value}</p>
      <p className="text-xs text-ink-400 mt-1">{sub}</p>
    </div>
  )
}
