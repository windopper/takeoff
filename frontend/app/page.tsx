import { getTakeoffPosts } from "./action/getTakeoffPosts";
import SmallPost from "./components/post/SmallPost";
import { Post } from "./types/post";

export default async function Home() {
  const posts = await getTakeoffPosts();

  return (
    <div className="min-h-screen relative">
      {/* 헤더 섹션 */}
      <header className="top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-zinc-900 font-bold text-sm">T</span>
              </div>
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Takeoff Posts
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 text-xs font-medium bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 rounded-full backdrop-blur-sm">
                {posts.posts.length}개 게시글
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {posts.posts.length > 0 ? (
          <div className="space-y-4">
            {posts.posts.map((post: Post, index: number) => (
              <SmallPost key={post.id || index} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <svg
                className="w-8 h-8 text-zinc-400 dark:text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              게시글이 없습니다
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-md text-sm">
              아직 표시할 게시글이 없습니다. 잠시 후 다시 확인해주세요.
            </p>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="mt-24 border-t border-zinc-200/20 dark:border-zinc-800/20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Takeoff.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
