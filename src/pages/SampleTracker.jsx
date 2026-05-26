import { useCallback, useEffect, useMemo, useState } from "react"
import AppShell from "../components/AppShell"
import StatusBadge from "../components/StatusBadge"
import { fetchSamples, addSample, updateSampleStatus, deleteSample } from "../lib/supabaseClient"
import { useToast } from "../lib/ToastContext"
import { TEST_TYPES, COLLECTION_CENTERS, nextSampleId } from "../data/mockSamples"

const STATUSES    = ["Received", "In Testing", "Completed", "Flagged"]
const PAGE_SIZE   = 10

function today() { return new Date().toISOString().split("T")[0] }
function daysBetween(dateStr) {
  return Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24))
}

export default function SampleTracker() {
  const { addToast } = useToast()
  const [samples, setSamples]           = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [typeFilter, setTypeFilter]     = useState("All")
  const [page, setPage]                 = useState(1)
  const [showAdd, setShowAdd]           = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    fetchSamples()
      .then((data) => { setSamples(data); setLoading(false) })
      .catch(() => { addToast("Failed to load samples", "error"); setLoading(false) })
  }, [addToast])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    return samples.filter((s) => {
      const matchSearch = !search || s.patient_name.toLowerCase().includes(search.toLowerCase()) || s.sample_id.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === "All" || s.status === statusFilter
      const matchType   = typeFilter === "All"   || s.test_type === typeFilter
      return matchSearch && matchStatus && matchType
    })
  }, [samples, search, statusFilter, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page])

  async function handleStatusChange(id, newStatus) {
    try {
      await updateSampleStatus(id, newStatus)
      setSamples((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s))
      addToast("Status updated", "success")
    } catch {
      addToast("Failed to update status", "error")
    }
  }

  async function handleDelete(id) {
    try {
      await deleteSample(id)
      setSamples((prev) => prev.filter((s) => s.id !== id))
      addToast("Sample removed", "success")
      setDeleteConfirm(null)
    } catch {
      addToast("Failed to delete sample", "error")
    }
  }

  async function handleAdd(formData) {
    try {
      const newSample = await addSample(formData)
      setSamples((prev) => [newSample, ...prev])
      addToast(`${newSample.sample_id} added`, "success")
      setShowAdd(false)
    } catch {
      addToast("Failed to add sample", "error")
    }
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Sample Tracker</h1>
          <p className="text-sm text-ink-500 mt-1">{samples.length} samples in system</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo hover:bg-indigo-dark text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Sample
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            className="input pl-9"
            placeholder="Search by patient name or sample ID…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <select className="input sm:w-40" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
          <option value="All">All Status</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="input sm:w-48" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}>
          <option value="All">All Test Types</option>
          {TEST_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-canvas-100 animate-pulse" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-canvas-50 text-left border-b border-canvas-200">
                  <Th>Sample ID</Th>
                  <Th>Patient Name</Th>
                  <Th>Test Type</Th>
                  <Th>Date Received</Th>
                  <Th>Days</Th>
                  <Th>Status</Th>
                  <Th>Update Status</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-100">
                {paginated.length === 0 ? (
                  <tr><td colSpan={8} className="px-6 py-10 text-center text-ink-500">No samples match your filters.</td></tr>
                ) : paginated.map((s) => {
                  const days = daysBetween(s.date_received)
                  const isOverdue = days >= 2 && (s.status === "Received" || s.status === "In Testing")
                  return (
                    <tr key={s.id} className={`transition-colors ${isOverdue ? "row-overdue" : "hover:bg-canvas-50"}`}>
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-dark">{s.sample_id}</td>
                      <td className="px-5 py-3.5 text-ink-900 font-medium">{s.patient_name}</td>
                      <td className="px-5 py-3.5 text-ink-700">{s.test_type}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-500">{s.date_received}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-mono font-medium ${isOverdue ? "text-rose-dark" : "text-ink-500"}`}>
                          {days}d {isOverdue && "⚠"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                      <td className="px-5 py-3.5">
                        <select
                          value={s.status}
                          onChange={(e) => handleStatusChange(s.id, e.target.value)}
                          className="text-xs border border-canvas-200 rounded-lg px-2 py-1.5 text-ink-700 focus:outline-none focus:ring-2 focus:ring-indigo bg-white"
                        >
                          {STATUSES.map((st) => <option key={st}>{st}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setDeleteConfirm(s)}
                          className="text-ink-300 hover:text-rose transition-colors"
                          title="Remove sample"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-3 border-t border-canvas-100 flex items-center justify-between">
            <p className="text-xs text-ink-500">
              Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <PageBtn onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>←</PageBtn>
              {[...Array(totalPages)].map((_, i) => (
                <PageBtn key={i} onClick={() => setPage(i+1)} active={page === i+1}>{i+1}</PageBtn>
              ))}
              <PageBtn onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>→</PageBtn>
            </div>
          </div>
        )}
      </div>

      {/* Add Sample Modal */}
      {showAdd && <AddSampleModal onClose={() => setShowAdd(false)} onAdd={handleAdd} existingSamples={samples} />}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-shell-900/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-float max-w-sm w-full p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-semibold text-ink-900 mb-1">Remove sample?</h3>
            <p className="text-sm text-ink-500 mb-5">
              This will permanently remove <span className="font-mono font-medium text-indigo-dark">{deleteConfirm.sample_id}</span> ({deleteConfirm.patient_name}) from the system.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 bg-rose hover:bg-rose-dark text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
                Remove
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-canvas-200 text-ink-700 text-sm font-medium py-2.5 rounded-xl hover:bg-canvas-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}

function AddSampleModal({ onClose, onAdd, existingSamples }) {
  const suggestedId = nextSampleId(existingSamples)
  const [form, setForm] = useState({
    patient_name: "",
    test_type: TEST_TYPES[0],
    date_received: today(),
    collection_center: COLLECTION_CENTERS[0],
  })
  const [loading, setLoading] = useState(false)

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.patient_name.trim()) return
    setLoading(true)
    await onAdd({ ...form, sample_id: suggestedId })
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-shell-900/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-float max-w-md w-full p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-ink-900">Log New Sample</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 text-xl leading-none">✕</button>
        </div>

        {/* Auto sample ID */}
        <div className="mb-4 rounded-xl bg-indigo/5 border border-indigo/15 px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-ink-500">Auto-assigned Sample ID</span>
          <span className="font-mono text-sm font-semibold text-indigo-dark">{suggestedId}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Patient Name">
            <input className="input" required placeholder="Full name" value={form.patient_name} onChange={(e) => update("patient_name", e.target.value)} />
          </Field>
          <Field label="Test Type">
            <select className="input" value={form.test_type} onChange={(e) => update("test_type", e.target.value)}>
              {TEST_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Collection Center">
            <select className="input" value={form.collection_center} onChange={(e) => update("collection_center", e.target.value)}>
              {COLLECTION_CENTERS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Date Received">
            <input className="input" type="date" value={form.date_received} onChange={(e) => update("date_received", e.target.value)} />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 bg-indigo hover:bg-indigo-dark text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-60">
              {loading ? "Adding…" : "Add Sample"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 border border-canvas-200 text-ink-700 text-sm font-medium py-2.5 rounded-xl hover:bg-canvas-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Th({ children }) {
  return <th className="px-5 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider whitespace-nowrap">{children}</th>
}

function PageBtn({ onClick, disabled, active, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
        ${active ? "bg-indigo text-white" : "text-ink-700 hover:bg-canvas-100 disabled:opacity-40 disabled:cursor-not-allowed"}`}
    >
      {children}
    </button>
  )
}
