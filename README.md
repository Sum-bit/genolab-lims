# Genolab LIMS — Lab Analytics & Sample Tracking Dashboard

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)

**Genolab LIMS** is a high-density, web-based Laboratory Information Management System (LIMS) designed for diagnostic laboratories and clinical research facilities. Built with a modern frontend stack, it provides real-time sample lifecycle tracking, automated overdue alerts, and performance metrics for laboratory staff.

---

## ✨ Features

* **📊 Interactive Operational Dashboard:** High-level stat cards showing daily intake, pending tests, completions, and flagged samples alongside 7-day volume trends and status distributions.
* **🧪 Real-Time Sample Tracker:** High-density data table supporting real-time status updates (`Received` → `In Testing` → `Completed` / `Flagged`), search filtering by patient name or sample ID, and multi-field dropdown filters.
* **🚨 Automated 48-Hour Overdue Flagging:** Visual urgency system that automatically calculates time deltas and alerts staff to pending samples exceeding 48 hours with dynamic UI badges.
* **📈 Advanced Analytics View:** Key operational KPIs (Average Completion Time, Flagged Rate) paired with interactive Recharts visualizations (Weekly Intake and Avg Turnaround Time by Test Type).
* **🔒 Authentication & Access Control:** Route protection powered by Supabase Auth and React Context API to ensure authorized access to sensitive lab metrics.
* **🎨 Custom Design Tokens & Dark Mode:** Built with a custom Tailwind token architecture, including dedicated typography (`DM Sans`, `Inter`, `JetBrains Mono`) and low-light laboratory dark mode support.

---

## 🛠️ Tech Stack & Architecture

* **Frontend Framework:** React 19 + Vite 8
* **Styling & UI:** Tailwind CSS (Class-based dark mode, custom design tokens)
* **State Management:** React Context API (`AuthContext`, `ToastContext`)
* **Backend & Database:** Supabase (PostgreSQL with Row Level Security policies)
* **Data Visualization:** Recharts
* **Build Tooling & Config:** PostCSS, Autoprefixer, ESLint

---

## 📁 Repository Structure

```text
genolab-lims/
├── src/
│   ├── components/         # Reusable UI components (AppShell, StatusBadge, ProtectedRoute)
│   ├── data/               # Local mock fallback state (mockSamples.js)
│   ├── lib/                # Supabase client configuration & React Context providers
│   ├── pages/              # Core application views (Dashboard, SampleTracker, Analytics, Settings)
│   ├── App.jsx             # Router configuration & protected layouts
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global Tailwind directives & custom font imports
├── supabase_schema.sql     # PostgreSQL database structure, ENUMs, and RLS policies
├── tailwind.config.js      # Design tokens, keyframe animations, and custom palettes
├── vite.config.js          # Build configuration & React plugin setup
└── package.json            # Project dependencies and scripts
