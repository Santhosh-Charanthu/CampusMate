import styles from "./post-card.module.css";
import HeartIcon from "./icons/HeartIcon";
import CommentIcon from "./icons/CommentIcon";
import ShareIcon from "./icons/ShareIcon";

export default function PostActions({
  liked,
  likes,
  initialComments,
  initialShares,
  onLike,
}) {
  return (
    <div className={styles.actions}>
      <button
        className={`${styles.actionButton} ${liked ? styles.liked : ""}`}
        onClick={onLike}
      >
        <HeartIcon filled={liked} />
        <span>{likes || "Like"}</span>
      </button>

      <button className={styles.actionButton}>
        <CommentIcon />
        <span>{initialComments || "Comment"}</span>
      </button>

      <button className={styles.actionButton}>
        <ShareIcon />
        <span>{initialShares || "Share"}</span>
      </button>
    </div>
  );
}
