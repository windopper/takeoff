import { getTakeoffPostById } from "@/app/action/getTakeoffPosts";
import { MaterialSymbolsChevronLeft } from "@/app/icons/MaterialSymbolsChevronLeft";
import { Post } from "@/app/types/post";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const id = (await params).id;
  const response = await getTakeoffPostById(id);

  const post: Post | null = response.post;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            게시글을 찾을 수 없습니다
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            요청하신 게시글이 존재하지 않거나 삭제되었습니다.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <MaterialSymbolsChevronLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 뒤로가기 버튼 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-8"
        >
          <MaterialSymbolsChevronLeft className="w-4 h-4" />
          목록으로 돌아가기
        </Link>

        {/* 포스트 헤더 */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-1 text-xs font-medium bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 rounded-lg">
              {post.category}
            </span>
            <span className="px-2.5 py-1 text-xs font-medium bg-blue-50/80 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
              {post.platform}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <div className="flex items-center gap-4">
              <Link
                href={post.originalUrl}
                target="_blank"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                {post.originalUrl}
              </Link>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </header>

        {/* 포스트 내용 */}
        <article className="card rounded-2xl p-8">
          <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none">
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[remarkRehype]}
            >
              {post.content}
            </Markdown>
          </div>
        </article>
      </div>
    </div>
  );
}