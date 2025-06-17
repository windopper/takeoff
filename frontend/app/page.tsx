import { getTakeoffPosts } from "./action/getTakeoffPosts";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import SmallPost from "./components/post/SmallPost";
import { Post } from "./types/post";

export default async function Home() {
  const posts = await getTakeoffPosts();

  return (
    <div className="min-h-screen relative">
      {/* 헤더 섹션 */}
      <Header postCount={posts.posts.length} />

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-6 mt-12 py-12">
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
      <Footer />
    </div>
  );
}
