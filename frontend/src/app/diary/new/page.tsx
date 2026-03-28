"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { Mood } from "@/types";
import MoodSelector from "@/components/MoodSelector";
import { createEntry } from "@/lib/actions/entry";

export default function NewEntryPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const newErrors: string[] = [];
    if (!title.trim()) newErrors.push("제목을 입력해 주세요.");
    if (!content.trim()) newErrors.push("본문을 입력해 주세요.");
    if (!mood) newErrors.push("기분을 선택해 주세요.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors([]);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("content", content);
    formData.set("mood", mood!);

    const result = await createEntry(formData);

    if (!result.success) {
      setErrors([result.error.message]);
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">새 일기 작성</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8 rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_16px_40px_-12px_rgba(28,25,23,0.12)] backdrop-blur-sm sm:p-8"
      >
        {errors.length > 0 && (
          <div role="alert" className="rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-700">
            <ul className="list-inside list-disc space-y-1">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-stone-700">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="오늘의 제목을 입력하세요"
            className="mt-1.5 block w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 shadow-inner shadow-stone-900/5 placeholder:text-stone-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-stone-700">
            본문
          </label>
          <textarea
            id="content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 하루를 기록해 보세요"
            className="mt-1.5 block w-full resize-y rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm leading-relaxed text-stone-900 shadow-inner shadow-stone-900/5 placeholder:text-stone-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20 focus:outline-none"
          />
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-stone-700">오늘의 기분</p>
          <MoodSelector value={mood} onChange={setMood} />
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-stone-200/80 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/10 transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "저장 중…" : "저장"}
          </button>
          <Link
            href="/diary"
            className="rounded-xl border border-stone-200 bg-white px-6 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
