import { getTakeoffPostCount, getTakeoffPosts } from "./action/getTakeoffPosts";
import TakeoffMainWithInfiniteScroll from "./components/TakeoffMainWithInfiniteScroll";

export default async function Home() {
  const posts = await getTakeoffPosts({ limit: 10, offset: 0 });
  const postCount = await getTakeoffPostCount();

  return (
    <TakeoffMainWithInfiniteScroll posts={posts.posts} postCount={postCount.count} />
  );
}
