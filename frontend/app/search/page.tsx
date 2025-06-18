import {
  getTakeoffPostCount,
  getTakeoffPosts,
} from "../action/getTakeoffPosts";
import { Suspense } from "react";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import TakeoffSearchWithInfiniteScroll from "./TakeoffSearchWithInfiniteScroll";
import { PAGE_SIZE } from "../constants/pagination";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    category?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page, category } = await searchParams;
  const query = q || '';
  const currentPage = parseInt(page || '1', 10);
  
  // 현재 페이지까지의 모든 게시글을 로드
  const postsToLoad = PAGE_SIZE * currentPage;
  const posts = await getTakeoffPosts({ 
    limit: postsToLoad, 
    offset: 0, 
    query: query,
    category: category,
  });
  const postCount = await getTakeoffPostCount({
    query: query,
    category: category,
  });

  return (
    <div className="min-h-screen relative">
      {/* 헤더 섹션 */}
      <Header postCount={postCount.count} />
      <TakeoffSearchWithInfiniteScroll
        posts={posts.posts}
        postCount={postCount.count}
        q={query}
        category={category || ''}
      />
      {/* 푸터 */}
      <Footer />
    </div>
  );
}
