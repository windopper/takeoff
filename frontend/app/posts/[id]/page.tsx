import { getTakeoffPostById } from "@/app/action/takeoffPosts";
import { Post } from "@/app/types/post";
import Link from "next/link";
import ReturnButton from "./ReturnButton";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import CategoryPills from "@/app/components/post/CategoryPills";
import { Metadata } from "next";
import NotFound from "./NotFound";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const id = (await params).id;
  const response = await getTakeoffPostById(id);
  const post: Post | null = response.post;
  return {
    title: post?.title,
    openGraph: {
      title: post?.title,
      locale: 'ko-KR',
      type: 'website',
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const id = (await params).id;
  const response = await getTakeoffPostById(id);

  const post: Post | null = response.post;

  if (! post) {
    return (
      <NotFound />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 뒤로가기 버튼 */}
        <ReturnButton />

        {/* 포스트 헤더 */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-1 text-xs font-medium bg-blue-50/80 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
              {post.platform}
            </span>
            <CategoryPills categories={post.category.split(",")} />
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