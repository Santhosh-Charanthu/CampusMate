import Header from "../components/Header/Header";
import PostFeed from "../components/PostFeed/PostFeed";
import { samplePosts } from "../data/posts";

export default function DashboardPage() {
  return (
    <div>
      <Header />
      <PostFeed posts={samplePosts} />
    </div>
  );
}
