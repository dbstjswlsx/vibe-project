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
      <h1 className="text-2xl font-bold text-gray-900">새 일기 작성</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {errors.length > 0 && (
          <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            <ul className="list-inside list-disc space-y-1">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="오늘의 제목을 입력하세요"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            본문
          </label>
          <textarea
            id="content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 하루를 기록해 보세요"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-y"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">오늘의 기분</p>
          <MoodSelector value={mood} onChange={setMood} />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "저장 중…" : "저장"}
          </button>
          <Link
            href="/diary"
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
