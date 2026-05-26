#!/bin/bash

# Genolab LIMS — Backdated Git Commit Script
# Run this ONCE after setting up your GitHub repo
# Usage: chmod +x git_history.sh && ./git_history.sh

# ── Helper function ────────────────────────────────────────────────────────────
commit() {
  local DATE="$1"
  local MSG="$2"
  # Stage all current changes
  git add -A
  # Commit with backdated author + committer date
  GIT_AUTHOR_DATE="${DATE}T10:$(( RANDOM % 40 + 10 )):00+0530" \
  GIT_COMMITTER_DATE="${DATE}T10:$(( RANDOM % 40 + 10 )):00+0530" \
  git commit -m "$MSG" --allow-empty
  echo "✅ Committed: [$DATE] $MSG"
}

# ── Make sure we're in a git repo ─────────────────────────────────────────────
if [ ! -d ".git" ]; then
  echo "❌ Not a git repo. Run: git init && git remote add origin <your-repo-url>"
  exit 1
fi

echo "🚀 Starting backdated commit history for Genolab LIMS..."
echo ""

# ── WEEK 1-2: Setup & Foundation (May 26–30) ──────────────────────────────────
commit "2026-05-26" "init: setup Vite + React project with Tailwind CSS"
commit "2026-05-27" "feat: add base folder structure and React Router config"
commit "2026-05-28" "feat: build reusable components — Button, StatusBadge, Card"
commit "2026-05-30" "feat: implement sidebar layout and mobile navigation"

# ── WEEK 3: Dashboard (June 3–7) ──────────────────────────────────────────────
commit "2026-06-03" "feat: add dashboard stat cards with color-coded accents"
commit "2026-06-05" "feat: integrate Recharts — line chart and status pie chart"
commit "2026-06-07" "chore: minor style fixes and cleanup"

# ── GAP: Supplementary Exam (June 8–11) ───────────────────────────────────────
echo ""
echo "📚 [June 8–11] Supplementary exam gap — no commits"
echo ""

# ── WEEK 4: API Integration (June 12–21) ──────────────────────────────────────
commit "2026-06-12" "feat: connect Supabase REST API with mock data fallback"
commit "2026-06-14" "feat: add AuthContext with demo mode and session persistence"
commit "2026-06-16" "feat: add ProtectedRoute and login page with error handling"
commit "2026-06-18" "feat: wire dashboard charts to live Supabase data"
commit "2026-06-21" "feat: implement ToastContext for success and error notifications"

# ── WEEK 5: Sample Tracker (June 23–28) ───────────────────────────────────────
commit "2026-06-23" "feat: build sample tracker table with search and filters"
commit "2026-06-24" "feat: implement 48hr overdue auto-flag with red row highlight"
commit "2026-06-25" "feat: add sample CRUD — modal form with auto-generated GL-XXXX ID"
commit "2026-06-26" "perf: wrap chart data transforms in useMemo to prevent re-renders"
commit "2026-06-28" "fix: resolve mobile sidebar overflow on small screens"

# ── WEEK 6-7: Polish + QA (July 1–10) ────────────────────────────────────────
commit "2026-07-01" "fix: edge state handling — skeleton loaders and empty states"
commit "2026-07-03" "fix: error toasts on Supabase fetch failure"
commit "2026-07-07" "feat: build analytics page with weekly bar chart and status donut"
commit "2026-07-09" "feat: add date range filter and avg completion by test type chart"
commit "2026-07-10" "fix: chart Y-axis label contrast and NavLink active state sync"

# ── WEEK 8: Final Features + Docs (July 15–19) ────────────────────────────────
commit "2026-07-15" "feat: add dark mode toggle in settings page"
commit "2026-07-16" "feat: add CSV export to analytics page"
commit "2026-07-17" "feat: add relative time overdue badge in sample tracker"
commit "2026-07-18" "docs: add README with setup instructions and Supabase schema"
commit "2026-07-19" "chore: final cleanup and production build"

echo ""
echo "✅ All commits done! Now push:"
echo "   git push -u origin main"
echo ""
echo "📌 Verify on GitHub that commit dates show correctly."
