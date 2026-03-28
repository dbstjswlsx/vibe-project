export type Mood = "happy" | "neutral" | "sad" | "angry" | "tired";

export interface Entry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: Mood;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };
