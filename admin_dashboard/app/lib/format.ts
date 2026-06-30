export function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const iso = new Date(dateStr).toISOString();
  return iso.replace("T", " ").slice(0, 16);
}
