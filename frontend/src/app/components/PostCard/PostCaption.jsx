import styles from "./post-card.module.css";

export default function PostCaption({
  user,
  caption,
  showFullCaption,
  setShowFullCaption,
}) {
  const MAX = 150;
  const long = caption.length > MAX;

  return (
    <div className={styles.caption}>
      <span className={styles.captionUser}>{user.name}</span>

      <span className={styles.captionText}>
        {showFullCaption ? caption : caption.slice(0, MAX)}
        {!showFullCaption && long && "..."}
      </span>

      {long && (
        <button
          className={styles.toggle}
          onClick={() => setShowFullCaption((prev) => !prev)}
        >
          {showFullCaption ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
