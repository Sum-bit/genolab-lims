const CONFIG = {
  Received:   { bg: "bg-indigo/10",  text: "text-indigo-dark",  dot: "bg-indigo"  },
  "In Testing": { bg: "bg-amber/10",  text: "text-amber-dark",   dot: "bg-amber"   },
  Completed:  { bg: "bg-emerald/10", text: "text-emerald-dark", dot: "bg-emerald" },
  Flagged:    { bg: "bg-rose/10",    text: "text-rose-dark",    dot: "bg-rose"    },
}

export default function StatusBadge({ status }) {
  const c = CONFIG[status] ?? CONFIG["Received"]
  return (
    <span className={`badge ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} mr-1.5`} />
      {status}
    </span>
  )
}
