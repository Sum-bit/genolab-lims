// Mock data — used when Supabase is not configured (.env missing)
// Mirrors the exact schema of the `samples` table in Supabase.

export const TEST_TYPES = [
  "Blood Count",
  "DNA Sequencing",
  "Urinalysis",
  "Tissue Biopsy",
  "Hormone Panel",
]

export const STATUSES = ["Received", "In Testing", "Completed", "Flagged"]

export const COLLECTION_CENTERS = [
  "Pune Central Lab",
  "Akurdi Collection Point",
  "Hadapsar Diagnostic Hub",
  "Kothrud Medical Center",
  "Wakad Health Clinic",
]

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split("T")[0]
}

function today() {
  return new Date().toISOString().split("T")[0]
}

export const MOCK_SAMPLES = [
  { id: "1",  sample_id: "GL-0001", patient_name: "Aditya Sharma",    test_type: "Blood Count",    date_received: today(),      status: "Received",   collection_center: "Pune Central Lab",        result: null,              created_at: new Date().toISOString() },
  { id: "2",  sample_id: "GL-0002", patient_name: "Priya Mehta",      test_type: "DNA Sequencing", date_received: today(),      status: "In Testing", collection_center: "Akurdi Collection Point", result: null,              created_at: new Date().toISOString() },
  { id: "3",  sample_id: "GL-0003", patient_name: "Rohan Desai",      test_type: "Urinalysis",     date_received: today(),      status: "Completed",  collection_center: "Hadapsar Diagnostic Hub", result: "Normal",          created_at: new Date().toISOString() },
  { id: "4",  sample_id: "GL-0004", patient_name: "Sneha Patil",      test_type: "Hormone Panel",  date_received: daysAgo(1),   status: "In Testing", collection_center: "Kothrud Medical Center",  result: null,              created_at: new Date().toISOString() },
  { id: "5",  sample_id: "GL-0005", patient_name: "Vikram Joshi",     test_type: "Tissue Biopsy",  date_received: daysAgo(1),   status: "Flagged",    collection_center: "Wakad Health Clinic",     result: "Requires retest", created_at: new Date().toISOString() },
  { id: "6",  sample_id: "GL-0006", patient_name: "Anjali Kulkarni",  test_type: "Blood Count",    date_received: daysAgo(2),   status: "Received",   collection_center: "Pune Central Lab",        result: null,              created_at: new Date().toISOString() },
  { id: "7",  sample_id: "GL-0007", patient_name: "Manish Tiwari",    test_type: "DNA Sequencing", date_received: daysAgo(2),   status: "Completed",  collection_center: "Akurdi Collection Point", result: "Variant detected", created_at: new Date().toISOString() },
  { id: "8",  sample_id: "GL-0008", patient_name: "Deepika Nair",     test_type: "Urinalysis",     date_received: daysAgo(3),   status: "Received",   collection_center: "Hadapsar Diagnostic Hub", result: null,              created_at: new Date().toISOString() },
  { id: "9",  sample_id: "GL-0009", patient_name: "Suresh Rao",       test_type: "Hormone Panel",  date_received: daysAgo(3),   status: "Completed",  collection_center: "Kothrud Medical Center",  result: "Within range",    created_at: new Date().toISOString() },
  { id: "10", sample_id: "GL-0010", patient_name: "Kavita Bose",      test_type: "Blood Count",    date_received: daysAgo(4),   status: "Flagged",    collection_center: "Wakad Health Clinic",     result: "Abnormal WBC",    created_at: new Date().toISOString() },
  { id: "11", sample_id: "GL-0011", patient_name: "Arjun Nambiar",    test_type: "Tissue Biopsy",  date_received: daysAgo(4),   status: "Completed",  collection_center: "Pune Central Lab",        result: "Benign",          created_at: new Date().toISOString() },
  { id: "12", sample_id: "GL-0012", patient_name: "Pooja Iyer",       test_type: "DNA Sequencing", date_received: daysAgo(5),   status: "In Testing", collection_center: "Akurdi Collection Point", result: null,              created_at: new Date().toISOString() },
  { id: "13", sample_id: "GL-0013", patient_name: "Rahul Verma",      test_type: "Blood Count",    date_received: daysAgo(5),   status: "Completed",  collection_center: "Hadapsar Diagnostic Hub", result: "Normal",          created_at: new Date().toISOString() },
  { id: "14", sample_id: "GL-0014", patient_name: "Nisha Gupta",      test_type: "Urinalysis",     date_received: daysAgo(6),   status: "Received",   collection_center: "Kothrud Medical Center",  result: null,              created_at: new Date().toISOString() },
  { id: "15", sample_id: "GL-0015", patient_name: "Amit Singh",       test_type: "Hormone Panel",  date_received: daysAgo(6),   status: "Completed",  collection_center: "Wakad Health Clinic",     result: "Low T3",          created_at: new Date().toISOString() },
  { id: "16", sample_id: "GL-0016", patient_name: "Sunita Reddy",     test_type: "Blood Count",    date_received: daysAgo(7),   status: "In Testing", collection_center: "Pune Central Lab",        result: null,              created_at: new Date().toISOString() },
  { id: "17", sample_id: "GL-0017", patient_name: "Kiran Malhotra",   test_type: "Tissue Biopsy",  date_received: daysAgo(8),   status: "Completed",  collection_center: "Akurdi Collection Point", result: "Malignant",       created_at: new Date().toISOString() },
  { id: "18", sample_id: "GL-0018", patient_name: "Divya Pillai",     test_type: "Urinalysis",     date_received: daysAgo(9),   status: "Flagged",    collection_center: "Hadapsar Diagnostic Hub", result: "Protein detected", created_at: new Date().toISOString() },
  { id: "19", sample_id: "GL-0019", patient_name: "Nikhil Shetty",    test_type: "DNA Sequencing", date_received: daysAgo(10),  status: "Completed",  collection_center: "Kothrud Medical Center",  result: "No variant",      created_at: new Date().toISOString() },
  { id: "20", sample_id: "GL-0020", patient_name: "Meera Agarwal",    test_type: "Hormone Panel",  date_received: daysAgo(11),  status: "Completed",  collection_center: "Wakad Health Clinic",     result: "Normal",          created_at: new Date().toISOString() },
  { id: "21", sample_id: "GL-0021", patient_name: "Rajesh Kumar",     test_type: "Blood Count",    date_received: daysAgo(12),  status: "Completed",  collection_center: "Pune Central Lab",        result: "Normal",          created_at: new Date().toISOString() },
  { id: "22", sample_id: "GL-0022", patient_name: "Ananya Menon",     test_type: "Urinalysis",     date_received: daysAgo(13),  status: "Completed",  collection_center: "Akurdi Collection Point", result: "Normal",          created_at: new Date().toISOString() },
  { id: "23", sample_id: "GL-0023", patient_name: "Siddharth Mishra", test_type: "DNA Sequencing", date_received: daysAgo(14),  status: "In Testing", collection_center: "Hadapsar Diagnostic Hub", result: null,              created_at: new Date().toISOString() },
  { id: "24", sample_id: "GL-0024", patient_name: "Lalita Pandey",    test_type: "Tissue Biopsy",  date_received: daysAgo(15),  status: "Completed",  collection_center: "Kothrud Medical Center",  result: "Benign",          created_at: new Date().toISOString() },
  { id: "25", sample_id: "GL-0025", patient_name: "Farhan Shaikh",    test_type: "Blood Count",    date_received: daysAgo(16),  status: "Completed",  collection_center: "Wakad Health Clinic",     result: "Normal",          created_at: new Date().toISOString() },
]

// Generate last-7-days intake data for charts
export function getIntakeTrend() {
  const counts = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split("T")[0]
    counts[key] = 0
  }
  for (const s of MOCK_SAMPLES) {
    if (counts[s.date_received] !== undefined) {
      counts[s.date_received]++
    }
  }
  return Object.entries(counts).map(([date, count]) => ({
    date: date.slice(5), // MM-DD
    count,
  }))
}

// Generate next sample ID
export function nextSampleId(existingSamples) {
  const nums = existingSamples
    .map((s) => parseInt(s.sample_id.replace("GL-", ""), 10))
    .filter((n) => !isNaN(n))
  const max = nums.length ? Math.max(...nums) : 0
  return `GL-${String(max + 1).padStart(4, "0")}`
}
