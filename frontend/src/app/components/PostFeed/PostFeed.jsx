import PostCard from "../PostCard/PostCard";
import styles from "./PostFeed.module.css";

export default function PostFeed({ posts }) {
  return (
    <div className={styles.feedWrapper}>
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
  );
}
