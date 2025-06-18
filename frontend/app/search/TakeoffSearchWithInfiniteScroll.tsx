"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getTakeoffPosts } from "../action/getTakeoffPosts";
import { Post } from "../types/post";
import { PAGE_SIZE } from "../constants/pagination";
import SmallPost from "../components/post/SmallPost";

export default function TakeoffSearchWithInfiniteScroll({
  posts,
  postCount,
  q,
  category,
}: {
  posts: Post[];
  postCount: number;
  q: string;
  category: string;
}) {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [_posts, setPosts] = useState<Post[]>(posts);
  const [hasMore, setHasMore] = useState<boolean>(posts.length < postCount);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const loadMore = async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);
    try {
      const newPosts = await getTakeoffPosts({
        limit: PAGE_SIZE,
        offset: posts.length,
        query: q,
        category: category,
      });

      setPosts((prev) => {
        const updatedPosts = [...prev, ...newPosts.posts];
        setHasMore(updatedPosts.length < postCount);
        return updatedPosts;
      });

      if (newPosts.posts.length === PAGE_SIZE) {
        const newPage = Math.floor(
          (posts.length + newPosts.posts.length) / PAGE_SIZE
        );
        router.replace(`/search?q=${q}&category=${category}&page=${newPage}`, {
          scroll: false,
        });
      } else {
        const newPage = Math.floor(posts.length / PAGE_SIZE) + 1;
        router.replace(`/search?q=${q}&category=${category}&page=${newPage}`, {
          scroll: false,
        });
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsFetching(false);
    }
  };

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
    };
  }, [loadMore]);

  return (
    <main className="max-w-4xl mx-auto px-6 mt-12 py-12">
      {posts.length > 0 ? (
        <div className="">
          {posts.map((post) => (
            <SmallPost key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            검색 결과가 없습니다.
          </p>
        </div>
      )}

      {isFetching && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-t-2 border-b-2 border-zinc-900 dark:border-zinc-100 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Scroll End Indicator */}
      {hasMore && !isFetching && (
        <div
          className="p-4 text-center flex items-center justify-center"
          onClick={loadMore}
        >
          <div
            className="flex items-center justify-center gap-2 p-2 hover:bg-zinc-100 hover:dark:bg-zinc-800/50 rounded-lg 
          cursor-pointer dark:text-zinc-400"
          >
            더 불러오기
          </div>
        </div>
      )}
    </main>
  );
}
