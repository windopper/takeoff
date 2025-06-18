"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getTakeoffPosts } from "../action/getTakeoffPosts";
import { Post } from "../types/post";
import SmallPost from "./post/SmallPost";
import { usePathname, useRouter } from "next/navigation";
import { PAGE_SIZE } from "../page";

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
  const [hasMore, setHasMore] = useState(posts.length < postCount);
  const router = useRouter();

  // useCallback으로 loadMore 함수를 메모이제이션하여 무한 루프 방지
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    try {
      const newPosts = await getTakeoffPosts({
        limit: PAGE_SIZE,
        offset: _posts.length
      });
      
      if (newPosts.posts.length > 0) {
        setPosts((prev) => {
          const updatedPosts = [...prev, ...newPosts.posts];
          // 더 이상 로드할 게시글이 있는지 확인
          setHasMore(updatedPosts.length < postCount);
          return updatedPosts;
        });
        
        // 마지막 페이지인 경우 페이지가 PAGE_SIZE 만큼 가져오지 못하기 때문에
        // +1 해줘야 함
        // 예시: 10개의 게시글이 있고, 10개의 게시글을 가져오면 페이지는 2이 되어야 함
        // 에시: 10개의 게시글이 있고, 7개 게시글을 가져오면 페이지는 2이 되어야 함.
        // 따라서 마지막 페이지인 경우 페이지를 1 증가시켜줘야 함
        if (newPosts.posts.length === PAGE_SIZE) {
          const newPage = Math.floor(
            (_posts.length + newPosts.posts.length) / PAGE_SIZE
          );
          router.replace(`/?page=${newPage}`, { scroll: false });
        } else {
            const newPage = Math.floor(_posts.length / PAGE_SIZE) + 1;
            router.replace(`/?page=${newPage}`, { scroll: false });
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, _posts.length, postCount, router]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMore();
          }
        });
      }
    );

    const currentRef = scrollRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMore]);

  // props가 변경될 때 상태 업데이트
  useEffect(() => {
    setPosts(posts);
    setHasMore(posts.length < postCount);
  }, [posts, postCount]);

  return (
    <main className="max-w-4xl mx-auto px-6 mt-12 py-12">
      {_posts.length > 0 ? (
        <div className="">
          {_posts.map((post: Post, index: number) => (
            <SmallPost key={`${post.id}-${index}`} post={post} />
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

      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-t-2 border-b-2 border-zinc-900 dark:border-zinc-100 rounded-full animate-spin"></div>
        </div>
      )}

      {/* 더 이상 로드할 게시글이 없을 때 메시지 */}
      {!hasMore && _posts.length > 0 && !isLoading && (
        <div className="flex justify-center py-8">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            모든 게시글을 확인했습니다.
          </p>
        </div>
      )}

      {/* Intersection Observer 트리거 요소 */}
      {hasMore && !isLoading && <div ref={scrollRef} className="h-4"></div>}
    </main>
  );
}
