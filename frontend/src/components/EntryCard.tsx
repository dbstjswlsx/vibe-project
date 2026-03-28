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
      className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-gray-900">
            {entry.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{formattedDate}</p>
        </div>
        <span
          className="flex shrink-0 flex-col items-center gap-0.5"
          title={mood.label}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <span className="text-xs text-gray-500">{mood.label}</span>
        </span>
      </div>
    </Link>
  );
}
