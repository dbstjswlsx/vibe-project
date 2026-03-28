"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MISSING_SUPABASE_ENV_MESSAGE } from "@/lib/supabase/env";
import type { ActionResult, Entry } from "@/types";

export async function createEntry(
  formData: FormData,
): Promise<ActionResult<Entry>> {
  const title = formData.get("title") as string | null;
  const content = formData.get("content") as string | null;
  const mood = formData.get("mood") as string | null;

  if (!title?.trim() || !content?.trim() || !mood) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: "모든 필드를 입력해 주세요." },
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      success: false,
      error: { code: "CONFIG_ERROR", message: MISSING_SUPABASE_ENV_MESSAGE },
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
    };
  }

  const { data, error } = await supabase
    .from("entries")
    .insert({ user_id: user.id, title: title.trim(), content: content.trim(), mood })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: { code: "INSERT_FAILED", message: error.message },
    };
  }

  revalidatePath("/diary");
  redirect("/diary");

  return { success: true, data };
}

export async function updateEntry(
  id: string,
  formData: FormData,
): Promise<ActionResult<Entry>> {
  const title = formData.get("title") as string | null;
  const content = formData.get("content") as string | null;
  const mood = formData.get("mood") as string | null;

  if (!title?.trim() || !content?.trim() || !mood) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: "모든 필드를 입력해 주세요." },
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      success: false,
      error: {
        code: "CONFIG_ERROR",
        message:
          "Supabase가 설정되지 않았습니다. .env.local의 NEXT_PUBLIC_SUPABASE_URL·ANON_KEY를 확인하세요.",
      },
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
    };
  }

  const { data, error } = await supabase
    .from("entries")
    .update({ title: title.trim(), content: content.trim(), mood })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: { code: "UPDATE_FAILED", message: error.message },
    };
  }

  revalidatePath("/diary");
  revalidatePath(`/diary/${id}`);
  redirect(`/diary/${id}`);

  return { success: true, data };
}

export async function deleteEntry(id: string): Promise<ActionResult<null>> {
  const supabase = await createClient();
  if (!supabase) {
    return {
      success: false,
      error: { code: "CONFIG_ERROR", message: MISSING_SUPABASE_ENV_MESSAGE },
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
    };
  }

  const { error } = await supabase.from("entries").delete().eq("id", id);

  if (error) {
    return {
      success: false,
      error: { code: "DELETE_FAILED", message: error.message },
    };
  }

  revalidatePath("/diary");
  redirect("/diary");

  return { success: true, data: null };
}
