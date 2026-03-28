import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import EntryCard from "@/components/EntryCard";
import SupabaseConfigMissing from "@/components/SupabaseConfigMissing";
import {
  diarySearchIlikePattern,
  postgrestQuotedIlikeValue,
  sanitizeDiarySearchInput,
} from "@/lib/search";
import DiarySearchBar from "./DiarySearchBar";

function rawSearchDisplay(raw: string | string[] | undefined): string {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (typeof s !== "string") return "";
  return s.trim().slice(0, 200);
}

export default async function DiaryListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const sp = await searchParams;
  const displayQuery = rawSearchDisplay(sp.q);
  const searchTerm = sanitizeDiarySearchInput(sp.q);
  const ilikePattern = diarySearchIlikePattern(searchTerm);
  /** URL에 검색 파라미터가 있으면 초기화 표시 (정제 후 빈 문자열이어도 동일) */
  const showSearchReset = displayQuery.length > 0;
  const searchFilterSkipped =
    showSearchReset && !ilikePattern;

  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="py-6 sm:py-8">
        <SupabaseConfigMissing />
      </div>
    );
  }

  let listQuery = supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (ilikePattern) {
    const quoted = postgrestQuotedIlikeValue(ilikePattern);
    listQuery = listQuery.or(
      `title.ilike.${quoted},content.ilike.${quoted}`,
    );
  }

  const { data: entries } = await listQuery;

  if (!entries || entries.length === 0) {
    if (ilikePattern) {
      return (
        <div className="flex flex-col gap-8">
          <DiarySearchBar
            defaultQuery={displayQuery}
            showReset={showSearchReset}
          />
          <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-stone-300/80 bg-white/60 px-8 py-16 text-center shadow-inner shadow-stone-900/5">
            <p className="text-4xl drop-shadow-sm">🔍</p>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-stone-900">
              검색 결과가 없습니다
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-500">
              {displayQuery ? (
                <>
                  <span className="font-medium text-stone-700">
                    「{displayQuery}」
                  </span>
                  에 맞는 일기가 없습니다. 다른 키워드로 검색해 보세요.
                </>
              ) : (
                "검색어를 입력해 주세요."
              )}
            </p>
            <Link
              href="/diary"
              className="mt-6 text-sm font-medium text-teal-800 underline-offset-2 hover:underline"
            >
              전체 목록 보기
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-8">
        <DiarySearchBar
          defaultQuery={displayQuery}
          showReset={showSearchReset}
        />
        <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-stone-300/80 bg-white/60 px-8 py-20 text-center shadow-inner shadow-stone-900/5">
          <p className="text-5xl drop-shadow-sm">📝</p>
          <h2 className="mt-5 text-xl font-semibold tracking-tight text-stone-900">
            아직 작성한 일기가 없습니다
          </h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-500">
            첫 번째 일기를 작성해 보세요!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <DiarySearchBar
        defaultQuery={displayQuery}
        showReset={showSearchReset}
      />
      {searchFilterSkipped ? (
        <p
          className="rounded-xl border border-amber-200/90 bg-amber-50/95 px-4 py-3 text-sm leading-relaxed text-amber-950/90"
          role="status"
        >
          검색어에 사용할 수 있는 글자가 없어 목록을 필터하지 않았습니다. 다른
          키워드로 다시 검색해 보세요.
        </p>
      ) : null}
      <div className="flex flex-col gap-4">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
