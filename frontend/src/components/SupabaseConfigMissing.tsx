export default function SupabaseConfigMissing() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-medium">Supabase 연결 정보가 없거나 잘못되었습니다</p>
      <p className="mt-2 text-amber-800 leading-relaxed">
        <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">frontend/.env.local</code>에 Supabase
        대시보드의{" "}
        <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">Project URL</code>과{" "}
        <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">anon public</code> 키를 각각{" "}
        <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
        로 넣은 뒤 개발 서버를 다시 시작하세요. URL은 반드시{" "}
        <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">https://</code>로 시작해야 합니다.
      </p>
    </div>
  );
}
