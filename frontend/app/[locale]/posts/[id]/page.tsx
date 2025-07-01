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
  const t = await getTranslations()
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

          <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800/50 backdrop-blur-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
                <span className="text-sm font-medium text-zinc-400">{t('originalLink')}</span>
              </div>
              <Link
                href={post.originalUrl}
                target="_blank"
                className="text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-all duration-200 hover:underline decoration-zinc-500 underline-offset-4 break-all"
              >
                {post.originalUrl}
              </Link>
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/50">
                <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>
                <p className="text-sm text-zinc-500">
                  {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
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
