/** Shown in UI when public Supabase env is missing or invalid (browser + server actions). */
export const MISSING_SUPABASE_ENV_MESSAGE =
  "Supabase가 설정되지 않았습니다. frontend/.env.local에 NEXT_PUBLIC_SUPABASE_URL(https://로 시작하는 주소)와 NEXT_PUBLIC_SUPABASE_ANON_KEY를 넣은 뒤 개발 서버를 다시 시작하세요.";

function isValidHttpUrl(s: string): boolean {
  if (!s || (!s.startsWith("https://") && !s.startsWith("http://"))) {
    return false;
  }
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Returns public Supabase env when both values look usable; otherwise null (no throw). */
export function getSupabasePublicEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  if (!isValidHttpUrl(url) || !anonKey) {
    return null;
  }
  return { url, anonKey };
}
