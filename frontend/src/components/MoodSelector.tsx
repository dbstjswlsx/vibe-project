"use client";

import type { Mood } from "@/types";
import { MOODS } from "@/lib/constants";

interface MoodSelectorProps {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

const moodKeys = Object.keys(MOODS) as Mood[];

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {moodKeys.map((key) => {
        const { emoji, label } = MOODS[key];
        const selected = value === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-4 py-3.5 text-sm transition ${
              selected
                ? "border-teal-600 bg-teal-50/90 text-teal-900 shadow-sm shadow-teal-900/10"
                : "border-stone-200 bg-white text-stone-600 shadow-sm hover:border-stone-300 hover:bg-stone-50"
            }`}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
