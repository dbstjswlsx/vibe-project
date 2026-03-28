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
    <div className="flex flex-wrap gap-2">
      {moodKeys.map((key) => {
        const { emoji, label } = MOODS[key];
        const selected = value === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-3 text-sm transition-colors ${
              selected
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
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
