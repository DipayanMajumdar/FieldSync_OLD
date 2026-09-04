const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function getDashboardStats() {
  const res = await fetch(`${API_URL}/stats`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function getEvidenceQueue() {
  const res = await fetch(`${API_URL}/entries`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch evidence");
  return res.json();
}

export async function submitFieldEntry(data: FormData) {
  const res = await fetch(`${API_URL}/sync`, {
    method: "POST",
    body: data,
  });
  // The Express backend automatically routes the image/audio to the FastAPI AI worker 
  // before saving the WBS rollup to PostgreSQL.
  if (!res.ok) throw new Error("Sync failed");
  return res.json();
}