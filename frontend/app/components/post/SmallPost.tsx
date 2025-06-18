import { Post } from "@/app/types/post";
import Link from "next/link";
import CategoryPills from "./CategoryPills";

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

  return (
    <Link
      href={`/posts/${post.id}`}
      className="group block p-6 hover:shadow-lg hover:shadow-zinc-900/5 dark:hover:shadow-zinc-900/20 
      hover:-translate-y-0.5 transition-all duration-200 ease-out
      "
    >
      {/* 상단 메타 정보 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-medium bg-blue-50/80 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
            {post.platform}
          </span>
          <CategoryPills categories={post.category.split(",")} />
        </div>
      </div>

      {/* 제목 */}
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3 line-clamp-2 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
        {post.title}
      </h2>

      {/* 하단 메타 정보 */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatDate(post.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
