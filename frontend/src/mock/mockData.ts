import type { Entry, Mood, User } from "@/types";

export const MOODS: Record<Mood, { emoji: string; label: string }> = {
  happy: { emoji: "😊", label: "행복" },
  neutral: { emoji: "😐", label: "보통" },
  sad: { emoji: "😢", label: "슬픔" },
  angry: { emoji: "😠", label: "화남" },
  tired: { emoji: "😴", label: "피곤" },
};

export const mockUser: User = {
  id: "user-001",
  email: "test@example.com",
};

export const mockEntries: Entry[] = [
  {
    id: "entry-001",
    user_id: "user-001",
    title: "봄이 왔다",
    content:
      "오늘 출근길에 벚꽃이 피기 시작한 걸 봤다. 겨울이 길었는데 드디어 봄이 온 것 같아서 기분이 좋았다. 점심에는 동료들과 공원에서 산책도 했다.",
    mood: "happy",
    created_at: "2026-03-27T09:00:00Z",
    updated_at: "2026-03-27T09:00:00Z",
  },
  {
    id: "entry-002",
    user_id: "user-001",
    title: "평범한 하루",
    content:
      "특별한 일 없이 하루가 지나갔다. 아침에 일어나서 커피 한 잔 마시고, 회사 가서 일하고, 퇴근 후에는 넷플릭스를 봤다.",
    mood: "neutral",
    created_at: "2026-03-26T20:30:00Z",
    updated_at: "2026-03-26T20:30:00Z",
  },
  {
    id: "entry-003",
    user_id: "user-001",
    title: "비 오는 날의 우울",
    content:
      "하루 종일 비가 내렸다. 우산을 안 가져가서 퇴근할 때 비를 맞았다. 집에 오니까 괜히 기분이 가라앉았다.",
    mood: "sad",
    created_at: "2026-03-25T21:00:00Z",
    updated_at: "2026-03-25T21:00:00Z",
  },
  {
    id: "entry-004",
    user_id: "user-001",
    title: "야근의 연속",
    content:
      "이번 주 세 번째 야근이다. 프로젝트 마감이 다가오는데 일정은 빠듯하고, 자꾸 요구사항이 바뀌어서 답답하다.",
    mood: "angry",
    created_at: "2026-03-24T23:45:00Z",
    updated_at: "2026-03-25T00:10:00Z",
  },
  {
    id: "entry-005",
    user_id: "user-001",
    title: "잠이 부족한 날",
    content:
      "어젯밤에 잠을 못 자서 하루 종일 졸렸다. 커피를 세 잔이나 마셨는데도 눈이 감겼다. 오늘은 일찍 자야지.",
    mood: "tired",
    created_at: "2026-03-23T19:00:00Z",
    updated_at: "2026-03-23T19:00:00Z",
  },
];
