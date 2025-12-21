"use client";

import { useState } from "react";
import PostCard from "../PostCard/PostCard";
import ShareBox from "../ShareBox/ShareBox";
import SidebarSuggestions from "../Sidebar/SidebarSuggestions";
import styles from "./PostFeed.module.css";

export default function PostFeed({ posts: initialPosts = [] }) {
  const [posts, setPosts] = useState(initialPosts || []);

  const handleCreatePost = (newPost) => {
    // prepend new post
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className={styles.feedWrapper}>
      <div className={styles.feedTop}>
        <div className={styles.feedTopLeft}>
          <ShareBox onCreate={handleCreatePost} />
        </div>
        <div className={styles.feedTopRight}>
          <div className={styles.sortRow}>
            <label className={styles.sortLabel}>Sort by:</label>
            <select className={styles.sortSelect} defaultValue="top">
              <option value="top">Top</option>
              <option value="recent">Recent</option>
            </select>
          </div>

          <SidebarSuggestions compact />
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.leftColumn}>
          <div className={styles.feed}>
            {posts.map((post, index) => (
              <PostCard
                key={index}
                user={post.user}
                content={post.content}
                caption={post.caption}
                initialLikes={post.initialLikes}
                initialComments={post.initialComments}
                initialShares={post.initialShares}
              />
            ))}
          </div>
        </div>

        <aside className={styles.rightColumn}>
          <SidebarSuggestions />
        </aside>
      </div>
    </div>
  );
}
