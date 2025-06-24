import Link from "next/link";
import SearchInput from "./Search";
import { Suspense } from "react";

export default function Header({
  postCount,
}: {
  postCount?: number;
}) {
  return (
    <header className="fixed top-0 z-50 w-full min-h-20 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xl font-semibold text-zinc-900 dark:text-zinc-100"
            >
              Takeoff.
            </Link>
          </div>
          {/* Routes */}
          <div className="flex flex-row items-center justify-start flex-1 gap-3 pl-8">
            <Link
              href="/timeline"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-100 text-nowrap"
            >
              AI 타임라인
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Suspense>
              <SearchInput />
            </Suspense>
            {/* {postCount && (
              <span className="px-3 py-1.5 text-xs font-medium bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 rounded-full backdrop-blur-sm">
                {postCount}개 게시글
              </span>
            )} */}
          </div>
        </div>
      </div>
    </header>
  );
}
