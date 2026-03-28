import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          나만의 일기장
        </h1>
        <p className="text-lg text-gray-600">
          하루의 감정과 이야기를 기록하고, 나만의 소중한 일상을 돌아보세요.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
        >
          시작하기
        </Link>
      </div>
    </div>
  );
}
