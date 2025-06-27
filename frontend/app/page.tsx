import { getTakeoffPostCount, getTakeoffPosts } from "./action/takeoffPosts";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import TakeoffMainWithInfiniteScroll from "./components/TakeoffMainWithInfiniteScroll";
import TimelineBanner from "./components/timeline/TimelineBanner";
import { PAGE_SIZE } from "./constants/pagination";
import BenchmarkBanner from "./components/benchmarking/BenchmarkBanner";
import WeeklyLatestNewsItem from "./components/weeklynews/WeeklyLatestNewsItem";

interface HomeProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

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
      <div className="relative max-w-4xl mx-auto px-6 mt-12 py-12">
        <div className="flex md:flex-row gap-4 mb-6 flex-col">
          <TimelineBanner />
          <BenchmarkBanner />
        </div>
        <WeeklyLatestNewsItem />
        <TakeoffMainWithInfiniteScroll
          posts={posts.posts}
          postCount={postCount.count}
        />
      </div>
      {/* 푸터 */}
      <Footer />
    </div>
  );
}
