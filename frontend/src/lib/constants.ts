import type { Mood } from "@/types";

export const MOODS: Record<Mood, { emoji: string; label: string }> = {
  happy: { emoji: "😊", label: "행복" },
  neutral: { emoji: "😐", label: "보통" },
  sad: { emoji: "😢", label: "슬픔" },
  angry: { emoji: "😠", label: "화남" },
  tired: { emoji: "😴", label: "피곤" },
};
