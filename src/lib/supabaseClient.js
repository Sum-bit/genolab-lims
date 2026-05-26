import { createClient } from "@supabase/supabase-js"
import { MOCK_SAMPLES, nextSampleId } from "../data/mockSamples"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured =
  Boolean(SUPABASE_URL) && Boolean(SUPABASE_ANON_KEY)

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

// ─── In-memory mock store (for demo mode) ────────────────────────────────────
let mockStore = [...MOCK_SAMPLES]

// ─── Data access functions ────────────────────────────────────────────────────

export async function fetchSamples() {
  if (!isSupabaseConfigured) {
    return [...mockStore].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )
  }
  const { data, error } = await supabase
    .from("samples")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function addSample(sample) {
  if (!isSupabaseConfigured) {
    const newSample = {
      ...sample,
      id: String(Date.now()),
      sample_id: nextSampleId(mockStore),
      status: "Received",
      result: null,
      created_at: new Date().toISOString(),
    }
    mockStore = [newSample, ...mockStore]
    return newSample
  }
  const { data, error } = await supabase
    .from("samples")
    .insert([{ ...sample, status: "Received", result: null }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateSampleStatus(id, status) {
  if (!isSupabaseConfigured) {
    mockStore = mockStore.map((s) =>
      s.id === id ? { ...s, status } : s
    )
    return
  }
  const { error } = await supabase
    .from("samples")
    .update({ status })
    .eq("id", id)
  if (error) throw error
}

export async function updateSampleResult(id, result) {
  if (!isSupabaseConfigured) {
    mockStore = mockStore.map((s) =>
      s.id === id ? { ...s, result } : s
    )
    return
  }
  const { error } = await supabase
    .from("samples")
    .update({ result })
    .eq("id", id)
  if (error) throw error
}

export async function deleteSample(id) {
  if (!isSupabaseConfigured) {
    mockStore = mockStore.filter((s) => s.id !== id)
    return
  }
  const { error } = await supabase.from("samples").delete().eq("id", id)
  if (error) throw error
}
