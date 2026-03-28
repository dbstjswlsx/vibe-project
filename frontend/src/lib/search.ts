const MAX_DIARY_SEARCH_LENGTH = 200;

/**
 * Diary list search: trim, cap length, remove LIKE wildcards and chars that
 * break PostgREST `or(...)` parsing.
 */
export function sanitizeDiarySearchInput(
  raw: string | string[] | undefined,
): string {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (typeof s !== "string") return "";
  return s
    .trim()
    .slice(0, MAX_DIARY_SEARCH_LENGTH)
    .replace(/[%_\\,()"'\x00-\x1f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function diarySearchIlikePattern(sanitized: string): string | null {
  if (!sanitized) return null;
  return `%${sanitized}%`;
}

/** PostgREST `or()` value; wrap in quotes so `.` etc. in the pattern do not break parsing. */
export function postgrestQuotedIlikeValue(pattern: string): string {
  const escaped = pattern.replace(/"/g, '""');
  return `"${escaped}"`;
}
