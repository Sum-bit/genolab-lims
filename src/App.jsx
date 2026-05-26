import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./lib/AuthContext"
import { ToastProvider } from "./lib/ToastContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import SampleTracker from "./pages/SampleTracker"
import Analytics from "./pages/Analytics"
import Settings from "./pages/Settings"

export default function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={darkMode ? "dark" : ""}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/tracker"   element={<ProtectedRoute><SampleTracker /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/settings"  element={<ProtectedRoute><Settings darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </div>
  )
}
