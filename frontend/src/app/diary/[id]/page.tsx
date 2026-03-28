import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MOODS } from "@/lib/constants";
import SupabaseConfigMissing from "@/components/SupabaseConfigMissing";
import DeleteButton from "./DeleteButton";

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="py-6 sm:py-8">
        <SupabaseConfigMissing />
      </div>
    );
  }

  const { data: entry } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .single();

  if (!entry) notFound();

  const mood = MOODS[entry.mood as keyof typeof MOODS];

  const createdAt = new Date(entry.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const updatedAt = new Date(entry.updated_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const isEdited = entry.created_at !== entry.updated_at;

  return (
    <article className="rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_16px_40px_-12px_rgba(28,25,23,0.12)] backdrop-blur-sm sm:p-8">
      <div className="flex items-center gap-3">
        <span className="text-3xl drop-shadow-sm">{mood.emoji}</span>
        <span className="rounded-full border border-teal-200/80 bg-teal-50/90 px-3.5 py-1 text-sm font-medium text-teal-900">
          {mood.label}
        </span>
      </div>

      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-stone-900 sm:text-[1.65rem]">{entry.title}</h1>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-500">
        <span>작성일: {createdAt}</span>
        {isEdited && <span>수정일: {updatedAt}</span>}
      </div>

      <div className="mt-8 whitespace-pre-wrap text-base leading-[1.75] text-stone-800">
        {entry.content}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-stone-200/80 pt-8">
        <Link
          href={`/diary/${id}/edit`}
          className="rounded-xl bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/10 transition hover:bg-teal-600"
        >
          수정
        </Link>
        <DeleteButton id={id} />
        <Link
          href="/diary"
          className="ml-auto text-sm font-semibold text-stone-500 underline-offset-4 transition hover:text-stone-800 hover:underline"
        >
          목록으로
        </Link>
      </div>
    </article>
  );
}
