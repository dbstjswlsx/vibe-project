import Link from "next/link";

interface DiarySearchBarProps {
  defaultQuery: string;
  /** URL에 `q`가 있을 때 초기화 링크 표시 */
  showReset: boolean;
}

export default function DiarySearchBar({
  defaultQuery,
  showReset,
}: DiarySearchBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
      <form
        action="/diary"
        method="get"
        className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center"
      >
        <label htmlFor="diary-search" className="sr-only">
          제목 또는 내용 검색
        </label>
        <input
          id="diary-search"
          name="q"
          type="search"
          defaultValue={defaultQuery}
          placeholder="제목 또는 내용으로 검색"
          maxLength={200}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-white/90 px-4 py-2.5 text-sm text-stone-900 shadow-sm shadow-stone-900/5 placeholder:text-stone-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200/60"
        />
        <div className="flex shrink-0 gap-2">
          <button
            type="submit"
            className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/10 transition hover:bg-teal-600"
          >
            검색
          </button>
          {showReset ? (
            <Link
              href="/diary"
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
            >
              초기화
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}
