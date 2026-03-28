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
      className="rounded-lg border border-red-300 px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
    >
      삭제
    </button>
  );
}
