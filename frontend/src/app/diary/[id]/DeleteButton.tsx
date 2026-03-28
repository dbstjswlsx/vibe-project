"use client";

import { deleteEntry } from "@/lib/actions/entry";

export default function DeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!window.confirm("정말로 이 일기를 삭제하시겠습니까?")) return;
    const result = await deleteEntry(id);
    if (!result.success) {
      alert(result.error.message);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-xl border border-rose-200 bg-white px-6 py-2.5 text-sm font-semibold text-rose-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50"
    >
      삭제
    </button>
  );
}
