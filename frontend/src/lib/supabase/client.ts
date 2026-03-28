import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

/** Returns null when env is missing or URL is not valid http(s). */
export function createClient(): SupabaseClient | null {
  const env = getSupabasePublicEnv();
  if (!env) {
    return null;
  }
  return createBrowserClient(env.url, env.anonKey);
}
