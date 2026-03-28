import { createClient } from "@/lib/supabase/server";
import EntryCard from "@/components/EntryCard";
import SupabaseConfigMissing from "@/components/SupabaseConfigMissing";

export default async function DiaryListPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="py-8">
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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-5xl">📝</p>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          아직 작성한 일기가 없습니다
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          첫 번째 일기를 작성해 보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
