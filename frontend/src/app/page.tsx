import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#f3efe6] via-stone-50 to-[#e6f0ec] px-5 py-16 sm:px-8">
      <div className="w-full max-w-lg space-y-8 rounded-[2rem] border border-stone-200/70 bg-white/75 p-10 text-center shadow-[0_25px_60px_-15px_rgba(28,25,23,0.12)] backdrop-blur-sm sm:p-12">
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-[2.75rem] sm:leading-tight">
          나만의 일기장
        </h1>
        <p className="text-lg leading-relaxed text-stone-600">
          하루의 감정과 이야기를 기록하고, 나만의 소중한 일상을 돌아보세요.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-2xl bg-teal-700 px-8 py-3.5 text-base font-semibold text-white shadow-md shadow-teal-900/15 transition hover:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          시작하기
        </Link>
      </div>
    </div>
  );
}
