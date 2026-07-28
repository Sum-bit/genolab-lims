import { createContext, useContext, useEffect, useState } from "react"
import { supabase, isSupabaseConfigured } from "./supabaseClient"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for persisted demo session
    const demo = sessionStorage.getItem("genolab_demo_user")
    if (demo) { setUser(JSON.parse(demo)); setLoading(false); return }

    if (!isSupabaseConfigured) { setLoading(false); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])

  // Demo login — no credentials needed
  async function loginDemo() {
    const demoUser = { email: "admin@genolab.in", id: "demo", role: "lab_admin", isDemo: true }
    sessionStorage.setItem("genolab_demo_user", JSON.stringify(demoUser))
    setUser(demoUser)
  }

  // Live login — uses Supabase auth
  async function loginLive(email, password) {
    if (!isSupabaseConfigured) throw new Error("Supabase is not configured. Add credentials to .env file.")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function logout() {
    sessionStorage.removeItem("genolab_demo_user")
    if (isSupabaseConfigured && user && !user.isDemo) {
      await supabase.auth.signOut()
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginDemo, loginLive, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
