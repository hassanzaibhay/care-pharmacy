export const ADMIN_API_BASE = "/api/admin";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${ADMIN_API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login";
  }
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
}
