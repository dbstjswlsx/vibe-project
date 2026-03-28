export default function SupabaseConfigMissing() {
  return (
    <div className="rounded-2xl border border-amber-200/90 bg-amber-50/95 p-5 text-sm text-amber-950 shadow-sm shadow-amber-900/5">
      <p className="font-semibold tracking-tight">Supabase 연결 정보가 없거나 잘못되었습니다</p>
      <p className="mt-3 leading-relaxed text-amber-900/90">
        <code className="rounded-md border border-amber-200/80 bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">
          frontend/.env.local
        </code>
        에 Supabase 대시보드의{" "}
        <code className="rounded-md border border-amber-200/80 bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">
          Project URL
        </code>
        과{" "}
        <code className="rounded-md border border-amber-200/80 bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">
          anon public
        </code>{" "}
        키를 각각{" "}
        <code className="rounded-md border border-amber-200/80 bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">
          NEXT_PUBLIC_SUPABASE_URL
        </code>
        ,{" "}
        <code className="rounded-md border border-amber-200/80 bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>
        로 넣은 뒤 개발 서버를 다시 시작하세요. URL은 반드시{" "}
        <code className="rounded-md border border-amber-200/80 bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">
          https://
        </code>
        로 시작해야 합니다.
      </p>
    </div>
  );
}
