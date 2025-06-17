import { Post } from "@/app/types/post";
import Link from "next/link";

export default function SmallPost({ post }: { post: Post }) {
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 점수에 따른 색상 클래스
  const getScoreColor = (score: number) => {
    if (score >= 100) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 50) return "text-blue-600 dark:text-blue-400";
    if (score >= 10) return "text-amber-600 dark:text-amber-400";
    return "text-zinc-500 dark:text-zinc-400";
  };

  return (
    <Link
      href={`/posts/${post.id}`}
      className="group block card rounded-2xl p-6 hover:shadow-lg hover:shadow-zinc-900/5 dark:hover:shadow-zinc-900/20 hover:-translate-y-0.5 transition-all duration-200 ease-out"
    >
      {/* 상단 메타 정보 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-medium bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 rounded-lg">
            {post.category}
          </span>
          <span className="px-2.5 py-1 text-xs font-medium bg-blue-50/80 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
            {post.platform}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`flex items-center gap-1 text-sm font-medium ${getScoreColor(
              post.post_score
            )}`}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs">{post.post_score}</span>
          </div>
        </div>
      </div>

      {/* 제목 */}
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3 line-clamp-2 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
        {post.title}
      </h2>

      {/* 하단 메타 정보 */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {post.author}
          </span>
          <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full"></span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {post.community}
          </span>
        </div>

        <div className="text-right">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatDate(post.created_at)}
          </p>
        </div>
      </div>
    </Link>
  );
}
