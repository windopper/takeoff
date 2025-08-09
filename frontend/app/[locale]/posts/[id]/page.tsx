import {
  getTakeoffPostById,
} from "@/app/action/takeoffPosts";
import { Post } from "@/app/types/post";
import Link from "next/link";
import ReturnButton from "../../../components/common/ReturnButton";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import CategoryPills from "@/app/components/post/CategoryPills";
import { Metadata } from "next";
import NotFound from "../../../components/common/NotFound";
import { getTranslations } from "next-intl/server";

interface PostPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const response = await getTakeoffPostById(id, locale);
  const post: Post | null = response;

  return {
    title: post?.title,
    description: post?.content,
    openGraph: {
      title: post?.title,
      description: post?.content,
      locale: locale === "ko" ? "ko-KR" : "en-US",
      type: "website",
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id, locale } = await params;
  const response = await getTakeoffPostById(id, locale);
  const post: Post | null = response;
  const t = await getTranslations({ locale, namespace: 'post' });
  const displayUrl = post?.originalUrl
    ? post.originalUrl.replace(/^https?:\/\//, "")
    : "";

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* 뒤로가기 버튼 */}
        <ReturnButton />

        {/* 포스트 헤더 */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1.5 text-xs font-semibold bg-zinc-800/80 text-zinc-300 rounded-xl border border-zinc-700/50 backdrop-blur-sm">
              {post.platform}
            </span>
            <CategoryPills categories={post.category.split(",")} />
          </div>

          <h1 className="md:text-4xl text-2xl font-bold text-zinc-100 mb-8 leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="bg-zinc-900/60 rounded-xl p-4 border border-zinc-800/60 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-2 min-w-0">
                {/* link icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-zinc-500"
                  aria-hidden="true"
                >
                  <path d="M13.06 7.94a1.5 1.5 0 0 1 2.12 0l.88.88a3.75 3.75 0 0 1 0 5.3l-3.54 3.54a3.75 3.75 0 0 1-5.3 0l-.88-.88a1.5 1.5 0 0 1 2.12-2.12l.88.88a.75.75 0 0 0 1.06 0l3.54-3.54a.75.75 0 0 0 0-1.06l-.88-.88a1.5 1.5 0 0 1 0-2.12Z" />
                  <path d="M10.94 16.06a1.5 1.5 0 0 1-2.12 0l-.88-.88a3.75 3.75 0 0 1 0-5.3l3.54-3.54a3.75 3.75 0 0 1 5.3 0l.88.88a1.5 1.5 0 1 1-2.12 2.12l-.88-.88a.75.75 0 0 0-1.06 0L7.96 11.9a.75.75 0 0 0 0 1.06l.88.88c.59.59.59 1.53 0 2.12Z" />
                </svg>
                <span className="sr-only">{t('originalLink')}</span>
                <Link
                  href={post.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate max-w-full sm:max-w-[360px] text-zinc-300 hover:text-zinc-100 transition-colors"
                >
                  {displayUrl}
                </Link>
                {/* external icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5 text-zinc-500"
                  aria-hidden="true"
                >
                  <path d="M13 3a1 1 0 1 0 0 2h4.586L9.293 13.293a1 1 0 0 0 1.414 1.414L19 6.414V11a1 1 0 1 0 2 0V3h-8Z" />
                  <path d="M5 6a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-4a1 1 0 1 0-2 0v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h4a1 1 0 1 0 0-2H5Z" />
                </svg>
              </div>

              <div className="hidden sm:block h-4 w-px bg-zinc-800/80" />

              <time
                dateTime={new Date(post.createdAt).toISOString()}
                className="inline-flex items-center gap-2 text-zinc-500"
              >
                {/* calendar icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M6.75 2.25a.75.75 0 0 1 .75.75V4.5h9V3a.75.75 0 0 1 1.5 0V4.5h.75A2.25 2.25 0 0 1 21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5H4.5A2.25 2.25 0 0 1 2.25 17.25V6.75A2.25 2.25 0 0 1 4.5 4.5h.75V3a.75.75 0 0 1 .75-.75ZM4.5 6h15a.75.75 0 0 1 .75.75V9H3.75V6.75A.75.75 0 0 1 4.5 6Zm15 4.5H3.75v6.75c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75V10.5Z" />
                </svg>
                {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>
        </header>

        {/* 포스트 내용 */}
        <article className="card rounded-2xl">
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
