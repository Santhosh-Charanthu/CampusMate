import Header from "../../components/Header/Header";
import PostFeed from "../../components/PostFeed/PostFeed";
import { samplePosts } from "../../data/posts";

export default function DashboardPage() {
  return (
    <div>
      <Header />

      {/* spacer to account for fixed header height */}
      <main style={{ paddingTop: 72 }}>
        <PostFeed posts={samplePosts} />
      </main>
    </div>
  );
}
