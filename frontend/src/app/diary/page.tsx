import { createClient } from "@/lib/supabase/server";
import EntryCard from "@/components/EntryCard";
import SupabaseConfigMissing from "@/components/SupabaseConfigMissing";

export default async function DiaryListPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="py-6 sm:py-8">
        <SupabaseConfigMissing />
      </div>
    );
  }

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-stone-300/80 bg-white/60 px-8 py-20 text-center shadow-inner shadow-stone-900/5">
        <p className="text-5xl drop-shadow-sm">📝</p>
        <h2 className="mt-5 text-xl font-semibold tracking-tight text-stone-900">
          아직 작성한 일기가 없습니다
        </h2>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-500">
          첫 번째 일기를 작성해 보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
