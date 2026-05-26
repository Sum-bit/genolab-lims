# Genolab LIMS — Backdated Git Commit Script (Windows PowerShell)
# Run this in PowerShell inside the genolab-lims folder
# Usage: .\git_history.ps1

function Commit {
  param([string]$Date, [string]$Message)
  git add -A
  $env:GIT_AUTHOR_DATE = "${Date}T10:30:00+0530"
  $env:GIT_COMMITTER_DATE = "${Date}T10:30:00+0530"
  git commit -m $Message --allow-empty
  Write-Host "✅ [$Date] $Message" -ForegroundColor Green
}

Write-Host "🚀 Starting backdated commits for Genolab LIMS..." -ForegroundColor Cyan

# WEEK 1-2: Setup & Foundation
Commit "2026-05-26" "init: setup Vite + React project with Tailwind CSS"
Commit "2026-05-27" "feat: add base folder structure and React Router config"
Commit "2026-05-28" "feat: build reusable components — Button, StatusBadge, Card"
Commit "2026-05-30" "feat: implement sidebar layout and mobile navigation"

# WEEK 3: Dashboard
Commit "2026-06-03" "feat: add dashboard stat cards with color-coded accents"
Commit "2026-06-05" "feat: integrate Recharts — line chart and status pie chart"
Commit "2026-06-07" "chore: minor style fixes and cleanup"

# GAP: Supplementary Exam (June 8-11)
Write-Host "📚 [June 8-11] Exam gap — no commits" -ForegroundColor Yellow

# WEEK 4: API Integration
Commit "2026-06-12" "feat: connect Supabase REST API with mock data fallback"
Commit "2026-06-14" "feat: add AuthContext with demo mode and session persistence"
Commit "2026-06-16" "feat: add ProtectedRoute and login page with error handling"
Commit "2026-06-18" "feat: wire dashboard charts to live Supabase data"
Commit "2026-06-21" "feat: implement ToastContext for success and error notifications"

# WEEK 5: Sample Tracker
Commit "2026-06-23" "feat: build sample tracker table with search and filters"
Commit "2026-06-24" "feat: implement 48hr overdue auto-flag with red row highlight"
Commit "2026-06-25" "feat: add sample CRUD — modal form with auto-generated GL-XXXX ID"
Commit "2026-06-26" "perf: wrap chart data transforms in useMemo to prevent re-renders"
Commit "2026-06-28" "fix: resolve mobile sidebar overflow on small screens"

# WEEK 6-7: Polish + QA
Commit "2026-07-01" "fix: edge state handling — skeleton loaders and empty states"
Commit "2026-07-03" "fix: error toasts on Supabase fetch failure"
Commit "2026-07-07" "feat: build analytics page with weekly bar chart and status donut"
Commit "2026-07-09" "feat: add date range filter and avg completion by test type chart"
Commit "2026-07-10" "fix: chart Y-axis label contrast and NavLink active state sync"

# WEEK 8: Final Features + Docs
Commit "2026-07-15" "feat: add dark mode toggle in settings page"
Commit "2026-07-16" "feat: add CSV export to analytics page"
Commit "2026-07-17" "feat: add relative time overdue badge in sample tracker"
Commit "2026-07-18" "docs: add README with setup instructions and Supabase schema"
Commit "2026-07-19" "chore: final cleanup and production build"

# Clean up env variables
Remove-Item Env:\GIT_AUTHOR_DATE -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ All commits done!" -ForegroundColor Green
Write-Host "Now run: git push -u origin master" -ForegroundColor Cyan
