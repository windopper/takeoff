"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getTakeoffPosts } from "../action/takeoffPosts";
import { PAGE_SIZE } from "../constants/pagination";
import { Post } from "../types/post";
import SmallPost from "./post/SmallPost";

export default function TakeoffMainWithInfiniteScroll({
  posts,
  postCount,
}: {
  posts: Post[];
  postCount: number;
}) {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [_posts, setPosts] = useState<Post[]>(posts);
  const [hasMore, setHasMore] = useState<boolean>(posts.length < postCount);
//   const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const loadMore = async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);
    try {
      const newPosts = await getTakeoffPosts({
        limit: PAGE_SIZE,
        offset: _posts.length,
      });

      setPosts((prev) => {
        const updatedPosts = [...prev, ...newPosts.posts];
        setHasMore(updatedPosts.length < postCount);
        return updatedPosts;
      });

      // URL을 업데이트
      const currentPage = Math.floor(_posts.length / PAGE_SIZE);
      // 마지막 페이지인 경우 페이지가 PAGE_SIZE 만큼 가져오지 못하기 때문에
      // newPosts.posts.length로 체크해서 다음 페이지 여부를 판단한다.
      // 위의 setHasMore랑 동일한 로직
      if (newPosts.posts.length === PAGE_SIZE) {
        const newPage = Math.floor(
          (_posts.length + newPosts.posts.length) / PAGE_SIZE
        );
        router.replace(`/?page=${newPage}`, { scroll: false });
      } else {
        const newPage = Math.floor(_posts.length / PAGE_SIZE) + 1;
        router.replace(`/?page=${newPage}`, { scroll: false });
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <main>
      {_posts.length > 0 ? (
        <div className="">
          {_posts.map((post) => (
            <SmallPost key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            아직 게시글이 없습니다.
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
          <div className="flex items-center justify-center gap-2 p-2 hover:bg-zinc-100 hover:dark:bg-zinc-800/50 rounded-lg 
          cursor-pointer dark:text-zinc-400">
            더 불러오기
          </div>
        </div>
      )}
    </main>
  );
}
