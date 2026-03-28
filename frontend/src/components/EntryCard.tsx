import Link from "next/link";
import type { Entry } from "@/types";
import { MOODS } from "@/lib/constants";

interface EntryCardProps {
  entry: Entry;
}

export default function EntryCard({ entry }: EntryCardProps) {
  const mood = MOODS[entry.mood];
  const formattedDate = new Date(entry.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/diary/${entry.id}`}
      className="block rounded-2xl border border-stone-200/80 bg-white/95 p-6 shadow-sm shadow-stone-900/5 transition hover:border-teal-200/70 hover:shadow-md hover:shadow-stone-900/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold tracking-tight text-stone-900">
            {entry.title}
          </h3>
          <p className="mt-1.5 text-sm text-stone-500">{formattedDate}</p>
        </div>
        <span
          className="flex shrink-0 flex-col items-center gap-0.5"
          title={mood.label}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <span className="text-xs font-medium text-stone-500">{mood.label}</span>
        </span>
      </div>
    </Link>
  );
}
