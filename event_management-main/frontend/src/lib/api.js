const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? "/api" : "");

function parseApiError(err) {
  if (!err?.detail) return "Request failed";
  if (typeof err.detail === "string") return err.detail;
  if (Array.isArray(err.detail)) {
    return err.detail.map((e) => e.msg || "Validation error").join(". ");
  }
  return "Request failed";
}

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    if (contentType.includes("application/json")) {
      const err = await res.json().catch(() => ({}));
      throw new Error(parseApiError(err));
    }
    throw new Error(
      `API error (${res.status}). Redeploy on Vercel or check the deployment logs.`
    );
  }
  if (res.status === 204) return null;
  if (!contentType.includes("application/json")) {
    throw new Error("API returned non-JSON. The server may be misconfigured.");
  }
  return res.json();
}

export async function getEvents(date) {
  const q = date ? `?date=${date}` : "";
  const res = await fetch(`${API_BASE}/events${q}`);
  return handleResponse(res);
}

export async function getEvent(id) {
  const res = await fetch(`${API_BASE}/events/${id}`);
  return handleResponse(res);
}

export async function createEvent(data) {
  const res = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateEvent(id, data) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteEvent(id) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}

export function formatDateForApi(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
