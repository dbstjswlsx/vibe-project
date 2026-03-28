"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DiaryLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    if (!supabase) {
      router.push("/login");
      router.refresh();
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      return;
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100/90 via-stone-50 to-[#eef5f2]">
      <header className="sticky top-0 z-10 border-b border-stone-200/80 bg-white/85 shadow-sm shadow-stone-900/5 backdrop-blur-md">
        <div className="mx-auto flex h-[3.25rem] max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/diary" className="text-lg font-semibold tracking-tight text-teal-800 transition hover:text-teal-700">
            나만의 일기장
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/diary/new"
              className="rounded-xl bg-teal-700 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-teal-900/10 transition hover:bg-teal-600"
            >
              새 일기
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">{children}</main>
    </div>
  );
}
