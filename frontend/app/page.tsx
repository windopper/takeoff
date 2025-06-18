import { getTakeoffPostCount, getTakeoffPosts } from "./action/getTakeoffPosts";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import TakeoffMainWithInfiniteScroll from "./components/TakeoffMainWithInfiniteScroll";

interface HomeProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export const PAGE_SIZE = 10;

export default async function Home({ searchParams }: HomeProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  
  // 현재 페이지까지의 모든 게시글을 로드
  const postsToLoad = PAGE_SIZE * currentPage;
  const posts = await getTakeoffPosts({ limit: postsToLoad, offset: 0 });
  const postCount = await getTakeoffPostCount({});

  return (
    <div className="min-h-screen relative">
      {/* 헤더 섹션 */}
      <Header postCount={postCount.count} />
      <TakeoffMainWithInfiniteScroll
        posts={posts.posts}
        postCount={postCount.count}
      />
      {/* 푸터 */}
      <Footer />
    </div>
  );
}
