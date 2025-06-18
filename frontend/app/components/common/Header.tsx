import Link from "next/link";
import SearchInput from "./Search";

export default function Header({
  postCount,
}: {
  postCount?: number;
}) {
  return (
    <header className="fixed top-0 z-50 w-full min-h-12 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xl font-semibold text-zinc-900 dark:text-zinc-100"
            >
              Takeoff.
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <SearchInput />
            {postCount && (
              <span className="px-3 py-1.5 text-xs font-medium bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 rounded-full backdrop-blur-sm">
                {postCount}개 게시글
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
