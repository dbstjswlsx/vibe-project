"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatAuthErrorMessage } from "@/lib/auth-errors";
import { MISSING_SUPABASE_ENV_MESSAGE } from "@/lib/supabase/env";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    if (!supabase) {
      setError(MISSING_SUPABASE_ENV_MESSAGE);
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(formatAuthErrorMessage(authError.message));
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/diary");
      router.refresh();
      return;
    }

    router.push("/login?registered=1");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f3efe6] via-stone-50 to-[#e6f0ec] px-4 py-12">
      <div className="w-full max-w-sm space-y-8 rounded-[1.75rem] border border-stone-200/80 bg-white/85 p-8 shadow-[0_20px_50px_-12px_rgba(28,25,23,0.15)] backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">나만의 일기장</h1>
          <p className="mt-2 text-sm text-stone-500">새 계정을 만들어 보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 block w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 shadow-inner shadow-stone-900/5 placeholder:text-stone-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password-confirm" className="block text-sm font-medium text-stone-700">
              비밀번호 확인
            </label>
            <input
              id="password-confirm"
              type="password"
              required
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 block w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 shadow-inner shadow-stone-900/5 placeholder:text-stone-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition hover:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "가입 중…" : "회원가입"}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-semibold text-teal-800 underline-offset-4 hover:text-teal-700 hover:underline">
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}
