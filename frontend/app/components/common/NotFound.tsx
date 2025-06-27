import Link from "next/link";
import BackButton from "./BackButton";
import IconoirMultiplePagesXmark from "@/app/icons/IconoirMultiplePagesXmark";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md mx-auto">
        {/* 404 아이콘 */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
            <IconoirMultiplePagesXmark className="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
          </div>
        </div>

        {/* 404 텍스트 */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            404
          </h1>
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
            게시글을 찾을 수 없습니다
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            요청하신 게시글이 존재하지 않거나
            <br />
            삭제되었을 수 있습니다.
          </p>
        </div>

        {/* 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-200 transform hover:scale-105"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            홈으로 돌아가기
          </Link>

          <BackButton />
        </div>
      </div>
    </div>
  );
}
