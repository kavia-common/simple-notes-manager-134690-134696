//
// Utility helpers for the Notes app.
//

// PUBLIC_INTERFACE
export function formatDate(isoString) {
  /** Format an ISO date string into a friendly short form. */
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    const now = new Date();
    const sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    const options = sameDay
      ? { hour: "2-digit", minute: "2-digit" }
      : { month: "short", day: "numeric" };
    return d.toLocaleString(undefined, options);
  } catch {
    return isoString;
  }
}

// PUBLIC_INTERFACE
export function truncate(text, maxLen = 120) {
  /** Truncate text for previews. */
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1).trim() + "…";
}
