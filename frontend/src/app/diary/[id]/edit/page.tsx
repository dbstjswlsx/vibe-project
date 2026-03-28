import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Mood } from "@/types";
import SupabaseConfigMissing from "@/components/SupabaseConfigMissing";
import EditEntryForm from "./EditEntryForm";

export default async function EditEntryPage({
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

  return (
    <EditEntryForm
      id={entry.id}
      defaultTitle={entry.title}
      defaultContent={entry.content}
      defaultMood={entry.mood as Mood}
    />
  );
}
