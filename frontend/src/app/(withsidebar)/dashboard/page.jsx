"use client";

import { useRouter } from "next/navigation";
import Header from "../../components/Header/Header";
import PostFeed from "../../components/PostFeed/PostFeed";
import { samplePosts } from "../../data/posts";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div>
      <Header />

      <button
        style={{ margin: "16px" }}
        onClick={() => router.push("/leaderboard")}
      >
        Go to Leaderboard
      </button>

      <PostFeed posts={samplePosts} />
    </div>
  );
}
