"use client";

import { useEffect, useRef, useState } from "react";
import { getTakeoffPosts } from "../action/getTakeoffPosts";
import { Post } from "../types/post";
import Footer from "./common/Footer";
import Header from "./common/Header";
import SmallPost from "./post/SmallPost";
import useSWRInfinite from "swr/infinite";

export default function TakeoffMainWithInfiniteScroll({
  posts,
  postCount,
}: {
  posts: Post[];
  postCount: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [_posts, setPosts] = useState<Post[]>(posts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      });
    });

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => {
      if (scrollRef.current) {
        observer.unobserve(scrollRef.current);
      }
    }
  }, [])

  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const newPosts = await getTakeoffPosts({ limit: 10, offset: _posts.length });
    if (newPosts.posts.length > 0) {
      setPosts(prev => [...prev, ...newPosts.posts]);
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen relative">
      {/* 헤더 섹션 */}
      <Header postCount={postCount} />

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-6 mt-12 py-12">
        {_posts.length > 0 ? (
          <div className="space-y-4">
            {_posts.map((post: Post, index: number) => (
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

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="w-16 h-16 border-t-2 border-b-2 border-zinc-900 dark:border-zinc-100 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Scroll End Indicator */}
      <div ref={scrollRef}></div>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}
