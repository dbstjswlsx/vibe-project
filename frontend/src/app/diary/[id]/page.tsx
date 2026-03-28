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
      <div className="py-8">
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
    <article>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{mood.emoji}</span>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
          {mood.label}
        </span>
      </div>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">{entry.title}</h1>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
        <span>작성일: {createdAt}</span>
        {isEdited && <span>수정일: {updatedAt}</span>}
      </div>

      <div className="mt-6 whitespace-pre-wrap text-gray-800 leading-relaxed">
        {entry.content}
      </div>

      <div className="mt-8 flex items-center gap-3 border-t border-gray-200 pt-6">
        <Link
          href={`/diary/${id}/edit`}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          수정
        </Link>
        <DeleteButton id={id} />
        <Link
          href="/diary"
          className="ml-auto text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          목록으로
        </Link>
      </div>
    </article>
  );
}
