
import {
  getTakeoffPostCount,
  getTakeoffPosts,
} from "../action/getTakeoffPosts";
import { Suspense } from "react";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import TakeoffSearchWithInfiniteScroll from "./TakeoffSearchWithInfiniteScroll";

export const PAGE_SIZE = 10;

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q: string; page: string; category: string }>;
}) {
  const { q, page, category } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const postsToLoad = PAGE_SIZE * currentPage;
  const posts = await getTakeoffPosts({ limit: postsToLoad, offset: 0, query: q, category: category });
  const postCount = await getTakeoffPostCount({ query: q, category: category });

  return (
    <div className="min-h-screen relative">
      {/* 헤더 섹션 */}
      <Header postCount={postCount.count} />
      <TakeoffSearchWithInfiniteScroll
        posts={posts.posts}
        postCount={postCount.count}
        q={q}
      />
      {/* 푸터 */}
      <Footer />
    </div>
  );
}
