import { createContext, useContext, useEffect, useState } from "react"
import { supabase, isSupabaseConfigured } from "./supabaseClient"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Demo mode: check sessionStorage for persisted demo session
      const demo = sessionStorage.getItem("genolab_demo_user")
      if (demo) setUser(JSON.parse(demo))
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])

  async function login(email, password) {
    if (!isSupabaseConfigured) {
      // Demo mode: accept any non-empty credentials
      if (!email || !password) throw new Error("Enter email and password.")
      const demoUser = { email, id: "demo", role: "lab_admin" }
      sessionStorage.setItem("genolab_demo_user", JSON.stringify(demoUser))
      setUser(demoUser)
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function logout() {
    if (!isSupabaseConfigured) {
      sessionStorage.removeItem("genolab_demo_user")
      setUser(null)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
