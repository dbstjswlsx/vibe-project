"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatAuthErrorMessage } from "@/lib/auth-errors";
import { MISSING_SUPABASE_ENV_MESSAGE } from "@/lib/supabase/env";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    if (!supabase) {
      setError(MISSING_SUPABASE_ENV_MESSAGE);
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(formatAuthErrorMessage(authError.message));
      setLoading(false);
      return;
    }

    router.push("/diary");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f3efe6] via-stone-50 to-[#e6f0ec] px-4 py-12">
      <div className="w-full max-w-sm space-y-8 rounded-[1.75rem] border border-stone-200/80 bg-white/85 p-8 shadow-[0_20px_50px_-12px_rgba(28,25,23,0.15)] backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">나만의 일기장</h1>
          <p className="mt-2 text-sm text-stone-500">로그인하여 일기를 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {registered && (
            <p role="status" className="rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800">
              회원가입이 완료되었습니다. 로그인해 주세요.
            </p>
          )}
          {error && (
            <p role="alert" className="rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700">
              이메일
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 block w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 shadow-inner shadow-stone-900/5 placeholder:text-stone-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 block w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 shadow-inner shadow-stone-900/5 placeholder:text-stone-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition hover:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "로그인 중…" : "로그인"}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="font-semibold text-teal-800 underline-offset-4 hover:text-teal-700 hover:underline">
            회원가입하기
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f3efe6] via-stone-50 to-[#e6f0ec] px-4 text-sm text-stone-500">
          불러오는 중…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
